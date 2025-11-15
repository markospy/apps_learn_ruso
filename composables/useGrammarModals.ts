// Estado global compartido para los modales
const conjugationsModal = useState('grammarModals.conjugations', () => null)
const vowelsModal = useState('grammarModals.vowels', () => null)
const genderModal = useState('grammarModals.gender', () => null)
const pronounsModal = useState('grammarModals.pronouns', () => null)
const consonantsModal = useState('grammarModals.consonants', () => null)

export const useGrammarModals = () => {
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
      }
    })
  }

  return {
    conjugationsModal,
    vowelsModal,
    genderModal,
    pronounsModal,
    consonantsModal,
    openModal
  }
}

