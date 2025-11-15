<template>
  <div>
    <!-- Componentes modulares de modales -->
    <GrammarRulesRussianConjugations ref="conjugationsModalRef" />
    <GrammarRulesRussianVowels ref="vowelsModalRef" />
    <GrammarRulesRussianGender ref="genderModalRef" />
    <GrammarRulesRussianPronouns ref="pronounsModalRef" />
    <GrammarRulesRussianConsonants ref="consonantsModalRef" />
  </div>
</template>

<script setup>
// Referencias locales a los componentes modales
const conjugationsModalRef = ref(null)
const vowelsModalRef = ref(null)
const genderModalRef = ref(null)
const pronounsModalRef = ref(null)
const consonantsModalRef = ref(null)

// Obtener el estado global compartido
const {
  conjugationsModal,
  vowelsModal,
  genderModal,
  pronounsModal,
  consonantsModal
} = useGrammarModals()

// Asignar las referencias locales al estado global cuando el componente se monte
onMounted(() => {
  conjugationsModal.value = conjugationsModalRef.value
  vowelsModal.value = vowelsModalRef.value
  genderModal.value = genderModalRef.value
  pronounsModal.value = pronounsModalRef.value
  consonantsModal.value = consonantsModalRef.value
})
</script>

