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

    // Primero dividir por saltos de línea para mantener párrafos
    const paragraphs = text.split('\n').filter(p => p.trim())

    const allSentences: string[] = []

    paragraphs.forEach(paragraph => {
      // Dividir por puntos, signos de exclamación e interrogación
      const sentences = paragraph
        .split(/([.!?]+)/)
        .filter(s => s.trim())

      let currentSentence = ''

      sentences.forEach((part, index) => {
        // Si es un signo de puntuación
        if (/^[.!?]+$/.test(part.trim())) {
          currentSentence += part
          if (currentSentence.trim()) {
            allSentences.push(currentSentence.trim())
            currentSentence = ''
          }
        } else {
          // Es texto
          currentSentence += part
        }
      })

      // Si queda texto sin signo de puntuación al final
      if (currentSentence.trim()) {
        allSentences.push(currentSentence.trim())
      }
    })

    // Si no se encontraron oraciones con puntuación, devolver párrafos
    if (allSentences.length === 0) {
      return paragraphs
    }

    return allSentences.filter(s => s.trim())
  }

  // Traducir texto usando API externa gratuita (LibreTranslate)
  const translateText = async (text: string, sourceLanguage: string = 'ru', targetLanguage: string = 'es'): Promise<string> => {
    if (!text || !text.trim()) return ''

    try {
      // Usar LibreTranslate API pública y gratuita
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Error en la traducción: ${response.statusText}`)
      }

      const data = await response.json()
      return data.translatedText || ''
    } catch (error) {
      console.error('Error al traducir:', error)
      // Si LibreTranslate falla, intentar con MyMemory como respaldo
      try {
        const fallbackResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
        )
        const fallbackData = await fallbackResponse.json()
        return fallbackData.responseData?.translatedText || ''
      } catch (fallbackError) {
        console.error('Error en traducción de respaldo:', fallbackError)
        return ''
      }
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

