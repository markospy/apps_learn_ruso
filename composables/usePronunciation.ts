import { transliterate } from 'transliteration'

export const usePronunciation = () => {
  const isPlaying = ref(false)
  const isRecording = ref<number | null>(null)
  const recordingResults = ref<Record<number, { recognized: string, accuracy: number, error?: string }>>({})
  let currentUtterance: SpeechSynthesisUtterance | null = null
  let currentRecognition: any = null

  // Transliterar texto ruso a español
  const transliterateToSpanish = (text: string): string => {
    if (!text) return ''

    let result = transliterate(text).toLowerCase()

    // Reemplazos específicos para sonidos rusos en español
    result = result
      .replace(/shch/g, 'shch')
      .replace(/yo/g, 'ió')
      .replace(/yu/g, 'iu')
      .replace(/ya/g, 'ia')
      .replace(/ye/g, 'e')
      .replace(/zh/g, 'zh')
      .replace(/ch/g, 'ch')
      .replace(/sh/g, 'sh')
      .replace(/ts/g, 'ts')
      .replace(/kh/g, 'j')
      .replace(/y([^aeiou])/g, 'i$1')
      .replace(/y$/g, 'i')
      .replace(/ь/g, '')
      .replace(/'/g, '')

    // Aplicar reducción vocálica
    const words = result.split(' ')
    result = words.map(word => {
      if (word.length > 3 && word.includes('o')) {
        return word.replace(/o(?![aeiou]*$)/g, 'a')
      }
      return word
    }).join(' ')

    return result
  }

  // Reproducir texto con síntesis de voz
  const speak = (text: string, options: { rate?: number, lang?: string } = {}) => {
    if (!text || !text.trim()) return

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API no está disponible')
      return
    }

    const speechSynthesis = window.speechSynthesis

    // Detener cualquier audio en reproducción
    if (currentUtterance) {
      speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = options.lang || 'ru-RU'
    utterance.rate = options.rate || 0.8
    utterance.pitch = 1
    utterance.volume = 1

    isPlaying.value = true

    utterance.onend = () => {
      isPlaying.value = false
      currentUtterance = null
    }

    utterance.onerror = () => {
      isPlaying.value = false
      currentUtterance = null
    }

    currentUtterance = utterance
    speechSynthesis.speak(utterance)
  }

  // Detener reproducción
  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      isPlaying.value = false
      currentUtterance = null
    }
  }

  // Dividir texto por oraciones (punto, signo de exclamación, signo de interrogación)
  const splitIntoSentences = (text: string): string[] => {
    if (!text.trim()) return []

    // Reemplazar saltos de línea por espacios para procesar todo el texto como un bloque
    const normalizedText = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()

    if (!normalizedText) return []

    // Dividir por puntos, signos de exclamación e interrogación, manteniendo los signos
    const parts = normalizedText.split(/([.!?]+)/)

    const sentences: string[] = []
    let currentSentence = ''

    parts.forEach((part) => {
      const trimmedPart = part.trim()
      if (!trimmedPart) return

      // Si es un signo de puntuación
      if (/^[.!?]+$/.test(trimmedPart)) {
        currentSentence += trimmedPart
        if (currentSentence.trim()) {
          sentences.push(currentSentence.trim())
          currentSentence = ''
        }
      } else {
        // Es texto
        currentSentence += (currentSentence ? ' ' : '') + trimmedPart
      }
    })

    // Si queda texto sin signo de puntuación al final
    if (currentSentence.trim()) {
      sentences.push(currentSentence.trim())
    }

    // Si no se encontraron oraciones con puntuación, devolver el texto completo
    if (sentences.length === 0) {
      return [normalizedText]
    }

    return sentences.filter(s => s.trim())
  }

  // Traducir texto usando API externa gratuita (MyMemory)
  const translateText = async (text: string, sourceLanguage: string = 'ru', targetLanguage: string = 'es'): Promise<string> => {
    if (!text || !text.trim()) return ''

    try {
      // Usar MyMemory Translation API (gratuita y sin autenticación)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      )

      if (!response.ok) {
        throw new Error(`Error en la traducción: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText
      }

      // Si hay un error en la respuesta
      if (data.responseStatus !== 200) {
        console.warn('MyMemory API error:', data.responseStatus)
        return ''
      }

      return ''
    } catch (error) {
      console.error('Error al traducir:', error)
      return ''
    }
  }

  // Procesar texto dividiéndolo por oraciones (solo transliteración, sin traducción)
  const processText = (text: string) => {
    if (!text.trim()) return []

    const sentences = splitIntoSentences(text)

    const processed = sentences.map((sentence) => {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) {
        return { original: '', transliteration: '', translation: '', words: [] }
      }

      const transliteration = transliterateToSpanish(trimmedSentence)

      const words = trimmedSentence.split(/\s+/).filter(w => w.trim()).map(word => ({
        text: word,
        transliteration: transliterateToSpanish(word)
      }))

      return {
        original: trimmedSentence,
        transliteration,
        translation: '', // Se llenará cuando el usuario haga clic en traducir
        words
      }
    })

    return processed
  }

  // Traducir todas las oraciones procesadas
  const translateSentences = async (sentences: any[], sourceLanguage: string = 'ru', targetLanguage: string = 'es') => {
    const translated = await Promise.all(sentences.map(async (sentence) => {
      if (!sentence.original || !sentence.original.trim()) {
        return sentence
      }

      const translation = await translateText(sentence.original, sourceLanguage, targetLanguage)
      return {
        ...sentence,
        translation
      }
    }))

    return translated
  }

  // Verificar si el navegador soporta reconocimiento de voz
  const isSpeechRecognitionSupported = (): boolean => {
    if (typeof window === 'undefined') return false
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  }

  // Iniciar grabación de voz para evaluar pronunciación
  const startRecording = (sentenceIndex: number, expectedText: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechRecognitionSupported()) {
        const error = 'Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.'
        recordingResults.value[sentenceIndex] = {
          recognized: '',
          accuracy: 0,
          error
        }
        reject(new Error(error))
        return
      }

      if (!expectedText || !expectedText.trim()) {
        const error = 'No hay texto de referencia para comparar'
        reject(new Error(error))
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = 'ru-RU'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      isRecording.value = sentenceIndex

      recognition.onresult = (event: any) => {
        const recognized = event.results[0][0].transcript.trim()
        const accuracy = calculateAccuracy(expectedText.trim(), recognized)

        recordingResults.value[sentenceIndex] = {
          recognized,
          accuracy
        }

        isRecording.value = null
        currentRecognition = null
        resolve()
      }

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento:', event.error)
        let errorMessage = 'Error al reconocer el audio'

        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No se detectó habla. Intenta de nuevo.'
            break
          case 'audio-capture':
            errorMessage = 'No se pudo acceder al micrófono. Verifica los permisos.'
            break
          case 'not-allowed':
            errorMessage = 'Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.'
            break
          case 'network':
            errorMessage = 'Error de red. Verifica tu conexión.'
            break
          default:
            errorMessage = `Error: ${event.error}`
        }

        recordingResults.value[sentenceIndex] = {
          recognized: '',
          accuracy: 0,
          error: errorMessage
        }

        isRecording.value = null
        currentRecognition = null
        reject(new Error(errorMessage))
      }

      recognition.onend = () => {
        if (isRecording.value === sentenceIndex) {
          // Si aún está grabando, significa que terminó inesperadamente
          isRecording.value = null
          currentRecognition = null
        }
      }

      currentRecognition = recognition

      try {
        recognition.start()
      } catch (error: any) {
        const errorMessage = 'No se pudo iniciar la grabación. Asegúrate de que el micrófono esté disponible.'
        recordingResults.value[sentenceIndex] = {
          recognized: '',
          accuracy: 0,
          error: errorMessage
        }
        isRecording.value = null
        currentRecognition = null
        reject(new Error(errorMessage))
      }
    })
  }

  // Detener grabación
  const stopRecording = () => {
    if (currentRecognition) {
      currentRecognition.stop()
      currentRecognition = null
    }
    isRecording.value = null
  }

  // Calcular precisión comparando el texto esperado con el reconocido
  const calculateAccuracy = (expected: string, recognized: string): number => {
    // Normalizar textos: convertir a minúsculas y eliminar puntuación
    const normalize = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[.,!?;:—–\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }

    const expectedNormalized = normalize(expected)
    const recognizedNormalized = normalize(recognized)

    if (!expectedNormalized) return 0
    if (!recognizedNormalized) return 0

    // Dividir en palabras
    const expectedWords = expectedNormalized.split(/\s+/).filter(w => w.trim())
    const recognizedWords = recognizedNormalized.split(/\s+/).filter(w => w.trim())

    if (expectedWords.length === 0) return 0

    // Calcular coincidencias exactas
    let exactMatches = 0
    const minLength = Math.min(expectedWords.length, recognizedWords.length)

    for (let i = 0; i < minLength; i++) {
      if (expectedWords[i] === recognizedWords[i]) {
        exactMatches++
      }
    }

    // Calcular precisión basada en palabras exactas
    const wordAccuracy = (exactMatches / expectedWords.length) * 100

    // También calcular similitud de caracteres usando Levenshtein distance
    const charSimilarity = calculateLevenshteinSimilarity(
      expectedNormalized.replace(/\s+/g, ''),
      recognizedNormalized.replace(/\s+/g, '')
    )

    // Combinar ambas métricas (70% palabras, 30% caracteres)
    const finalAccuracy = (wordAccuracy * 0.7) + (charSimilarity * 0.3)

    return Math.round(Math.max(0, Math.min(100, finalAccuracy)))
  }

  // Calcular similitud usando distancia de Levenshtein
  const calculateLevenshteinSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 100
    if (str1.length === 0 || str2.length === 0) return 0

    const matrix: number[][] = []

    // Inicializar primera fila y columna
    for (let i = 0; i <= str2.length; i++) {
      matrix[0] = matrix[0] || []
      matrix[0][i] = i
    }

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = matrix[i] || []
      matrix[i][0] = i
    }

    // Llenar la matriz
    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,     // eliminación
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j - 1] + 1  // sustitución
          )
        }
      }
    }

    const distance = matrix[str1.length][str2.length]
    const maxLength = Math.max(str1.length, str2.length)
    const similarity = ((maxLength - distance) / maxLength) * 100

    return Math.round(Math.max(0, Math.min(100, similarity)))
  }

  // Limpiar resultado de grabación
  const clearRecordingResult = (sentenceIndex: number) => {
    if (recordingResults.value[sentenceIndex]) {
      delete recordingResults.value[sentenceIndex]
    }
  }

  return {
    isPlaying,
    isRecording,
    recordingResults,
    isSpeechRecognitionSupported,
    transliterateToSpanish,
    speak,
    stop,
    startRecording,
    stopRecording,
    clearRecordingResult,
    processText,
    translateText,
    translateSentences,
    splitIntoSentences,
  }
}

