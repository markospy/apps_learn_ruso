<template>
  <div>
    <!-- Botones flotantes de ayuda -->
    <div class="top-6 right-6 z-40 fixed flex flex-col gap-2">
      <button
        @click="conjugationsModal?.open()"
        class="flex justify-center items-center bg-blue-100 hover:bg-blue-200 shadow-lg rounded-full w-12 h-12 text-blue-600 transition-colors"
        title="Ver tabla de conjugaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <button
        @click="vowelsModal?.open()"
        class="flex justify-center items-center bg-green-100 hover:bg-green-200 shadow-lg rounded-full w-12 h-12 text-green-600 transition-colors"
        title="Ver pronunciación de vocales"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      <button
        @click="genderModal?.open()"
        class="flex justify-center items-center bg-pink-100 hover:bg-pink-200 shadow-lg rounded-full w-12 h-12 text-pink-600 transition-colors"
        title="Ver reglas de géneros de sustantivos"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>

      <button
        @click="pronounsModal?.open()"
        class="flex justify-center items-center bg-teal-100 hover:bg-teal-200 shadow-lg rounded-full w-12 h-12 text-teal-600 transition-colors"
        title="Ver pronombres personales y posesivos"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </div>

    <!-- Componentes modulares de modales -->
    <GrammarRulesRussianConjugations ref="conjugationsModal" />
    <GrammarRulesRussianVowels ref="vowelsModal" />
    <GrammarRulesRussianGender ref="genderModal" />
    <GrammarRulesRussianPronouns ref="pronounsModal" />
  </div>
</template>

<script setup>
// Referencias a los componentes modales
const conjugationsModal = ref(null)
const vowelsModal = ref(null)
const genderModal = ref(null)
const pronounsModal = ref(null)
</script>

