export const useConjugation = () => {
  const PRONOUNS = {
    'Я': 1,
    'Ты': 2,
    'Он/Она': 3,
    'Мы': 4,
    'Вы': 5,
    'Они': 6,
  }

  const PRONOUN_TRANSLATIONS = {
    'Я': 'Yo',
    'Ты': 'Tú',
    'Он/Она': 'Él/Ella',
    'Мы': 'Nosotros',
    'Вы': 'Usted/Ustedes',
    'Они': 'Ellos/Ellas'
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
    getPronounTranslation,
    checkAnswer,
  }
}

