export const useGrammarModals = () => {
  // Estado global compartido para los modales
  const conjugationsModal = useState<any>('grammarModals.conjugations', () => null)
  const vowelsModal = useState<any>('grammarModals.vowels', () => null)
  const genderModal = useState<any>('grammarModals.gender', () => null)
  const pronounsModal = useState<any>('grammarModals.pronouns', () => null)
  const consonantsModal = useState<any>('grammarModals.consonants', () => null)
  const casesModal = useState<any>('grammarModals.cases', () => null)

  const openModal = (modalType: string) => {
    nextTick(() => {
      switch (modalType) {
        case 'conjugations':
          conjugationsModal.value?.open()
          break
        case 'vowels':
          vowelsModal.value?.open()
          break
        case 'consonants':
          consonantsModal.value?.open()
          break
        case 'gender':
          genderModal.value?.open()
          break
        case 'pronouns':
          pronounsModal.value?.open()
          break
        case 'cases':
          casesModal.value?.open()
          break
      }
    })
  }

  return {
    conjugationsModal,
    vowelsModal,
    genderModal,
    pronounsModal,
    consonantsModal,
    casesModal,
    openModal
  }
}

