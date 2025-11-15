import { transliterate } from 'transliteration'

export const usePronunciation = () => {
  const isPlaying = ref(false)
  let currentUtterance: SpeechSynthesisUtterance | null = null

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

  return {
    isPlaying,
    transliterateToSpanish,
    speak,
    stop,
    processText,
    translateText,
    translateSentences,
    splitIntoSentences,
  }
}

