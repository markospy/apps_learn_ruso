export const useConjugation = () => {
  const PRONOUNS = {
    'Я': 1,
    'Ты': 2,
    'Он/Она': 3,
    'Мы': 4,
    'Вы': 5,
    'Они': 6,
  }

  const ENDINGS_1 = {
    1: 'ю',
    2: 'ешь',
    3: 'ет',
    4: 'ем',
    5: 'ете',
    6: 'ют'
  }

  const ENDINGS_2 = {
    1: 'ю',
    2: 'ишь',
    3: 'ит',
    4: 'им',
    5: 'ите',
    6: 'ят'
  }

  const PRONOUN_TRANSLATIONS = {
    'Я': 'Yo',
    'Ты': 'Tú',
    'Он/Она': 'Él/Ella',
    'Мы': 'Nosotros',
    'Вы': 'Usted/Ustedes',
    'Они': 'Ellos/Ellas'
  }

  // Obtener la raíz del verbo
  const getVerbRoot = (infinitive: string, type: number): string => {
    infinitive = infinitive.trim()

    if (type === 1) {
      if (infinitive.endsWith('ать') || infinitive.endsWith('ять') || infinitive.endsWith('еть')) {
        return infinitive.substring(0, infinitive.length - 3)
      }
      if (infinitive.endsWith('ть')) {
        return infinitive.substring(0, infinitive.length - 2)
      }
    } else if (type === 2) {
      if (infinitive.endsWith('ить')) {
        return infinitive.substring(0, infinitive.length - 3)
      }
      if (infinitive.endsWith('ть')) {
        return infinitive.substring(0, infinitive.length - 2)
      }
    }

    return infinitive
  }

  // Conjugar verbo
  const conjugate = (verb: any, pronoun: string): string => {
    const endings = verb.conjugationType === 1 ? ENDINGS_1 : ENDINGS_2
    const pronounCode = PRONOUNS[pronoun as keyof typeof PRONOUNS]
    const ending = endings[pronounCode as keyof typeof endings]
    return verb.root + ending
  }

  // Obtener traducción del pronombre
  const getPronounTranslation = (pronoun: string): string => {
    return PRONOUN_TRANSLATIONS[pronoun as keyof typeof PRONOUN_TRANSLATIONS] || ''
  }

  // Verificar respuesta
  const checkAnswer = (userInput: string, correctAnswer: string): boolean => {
    return userInput.trim().toLowerCase() === correctAnswer.toLowerCase()
  }

  return {
    PRONOUNS,
    PRONOUN_TRANSLATIONS,
    getVerbRoot,
    conjugate,
    getPronounTranslation,
    checkAnswer,
  }
}

