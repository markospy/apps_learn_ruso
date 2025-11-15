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

  // Procesar líneas de texto para mostrar transliteración
  const processText = (text: string) => {
    if (!text.trim()) return []

    const lines = text.split('\n')
    return lines.map(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) {
        return { original: '', transliteration: '', words: [] }
      }

      const transliteration = transliterateToSpanish(trimmedLine)

      const words = trimmedLine.split(/\s+/).filter(w => w.trim()).map(word => ({
        text: word,
        transliteration: transliterateToSpanish(word)
      }))

      return {
        original: trimmedLine,
        transliteration,
        words
      }
    })
  }

  return {
    isPlaying,
    transliterateToSpanish,
    speak,
    stop,
    processText,
  }
}

