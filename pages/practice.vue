<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Práctica de Conjugación</h1>
      <p class="text-gray-600">Practica verbos rusos y mejora tu conjugación</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center card">
      <p class="text-gray-600">Cargando verbos...</p>
    </div>

    <!-- Sin verbos -->
    <div v-else-if="verbs.length === 0" class="p-8 text-center card">
      <div class="text-gray-500">
        <p class="mb-4 text-xl">Aún no tienes verbos para practicar</p>
        <p class="mb-6">Ve a la sección de Verbos para agregar algunos</p>
        <NuxtLink to="/verbs" class="inline-block btn-primary">
          Ir a Verbos
        </NuxtLink>
      </div>
    </div>

    <!-- Práctica activa -->
    <div v-else class="space-y-6">
      <!-- Verbo actual -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 card">
        <div class="text-center">
          <p class="mb-2 text-gray-600 text-lg">Conjuga el verbo:</p>
          <p class="mb-2 font-extrabold text-blue-700 text-5xl">
            {{ currentVerb?.infinitive || '...' }}
          </p>
          <p class="text-gray-500">
            Conjugación {{ currentVerb?.conjugationType }}
          </p>
        </div>
      </div>

      <!-- Formulario de conjugaciones -->
      <div class="p-6 card">
        <div class="space-y-4">
          <div
            v-for="pronoun in Object.keys(PRONOUNS)"
            :key="pronoun"
            class="flex sm:flex-row flex-col items-center gap-3 p-4 rounded-lg transition-colors"
            :class="{
              'bg-green-50 border-2 border-green-300': checkedAnswers[pronoun] === true,
              'bg-red-50 border-2 border-red-300': checkedAnswers[pronoun] === false,
              'bg-gray-50': checkedAnswers[pronoun] === null
            }"
          >
            <!-- Pronombre -->
            <div class="flex-shrink-0 w-32 sm:text-left text-center">
              <p class="font-bold text-gray-800 text-lg">{{ pronoun }}</p>
              <p class="text-gray-600 text-sm">{{ getPronounTranslation(pronoun) }}</p>
              <p class="text-gray-600 text-sm">{{ transliterateToSpanish(pronoun) }}</p>
            </div>

            <!-- Botón de audio -->
            <button
              @click="playPronunciation(pronoun)"
              :disabled="!currentVerb"
              class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
              title="Escuchar pronunciación"
            >
              <svg v-if="!isPlayingPronoun[pronoun]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- Input -->
            <input
              type="text"
              v-model="userInputs[pronoun]"
              :disabled="checkedAnswers[pronoun] !== null"
              @keyup.enter="checkAnswer(pronoun)"
              placeholder="Escribe la conjugación"
              class="flex-grow conjugation-input"
              :class="{
                'correct': checkedAnswers[pronoun] === true,
                'incorrect': checkedAnswers[pronoun] === false
              }"
            />

            <!-- Botón verificar -->
            <button
              @click="checkAnswer(pronoun)"
              :disabled="!currentVerb || checkedAnswers[pronoun] !== null || !userInputs[pronoun]?.trim()"
              class="flex-shrink-0 px-6 py-2 btn-primary"
            >
              {{ checkedAnswers[pronoun] === null ? 'Comprobar' : checkedAnswers[pronoun] ? '✓' : '✗' }}
            </button>

            <!-- Feedback -->
            <div v-if="checkedAnswers[pronoun] !== null" class="flex-shrink-0 min-w-[200px]">
              <p v-if="checkedAnswers[pronoun]" class="font-semibold text-green-600">
                ¡Correcto!
              </p>
              <p v-else class="font-semibold text-red-600">
                Correcto: <span class="font-bold">{{ conjugate(currentVerb, pronoun) }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4 mt-6">
          <button
            @click="newVerb"
            class="flex-1 py-3 text-xl btn-primary"
          >
            Nuevo Verbo
          </button>
          <button
            @click="resetPractice"
            class="px-6 py-3 btn-secondary"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>

    <!-- Modales de ayuda -->
    <HelpModals />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { verbs, loading, fetchVerbs, selectRandomVerb } = useVerbs()
const { PRONOUNS, getPronounTranslation, checkAnswer: checkConjugation } = useConjugation()
const { speak, stop, transliterateToSpanish } = usePronunciation()

// Estado local
const currentVerb = ref(null)
const userInputs = reactive({})
const checkedAnswers = reactive({})
const isPlayingPronoun = reactive({})

// Inicializar inputs
Object.keys(PRONOUNS).forEach(pronoun => {
  userInputs[pronoun] = ''
  checkedAnswers[pronoun] = null
  isPlayingPronoun[pronoun] = false
})

// Cargar verbos al montar
onMounted(async () => {
  await fetchVerbs()
  if (verbs.value.length > 0) {
    newVerb()
  }
})

// Seleccionar nuevo verbo
const newVerb = () => {
  stop()
  resetPractice()
  currentVerb.value = selectRandomVerb()
}

// Reiniciar práctica
const resetPractice = () => {
  stop()
  Object.keys(PRONOUNS).forEach(pronoun => {
    userInputs[pronoun] = ''
    checkedAnswers[pronoun] = null
    isPlayingPronoun[pronoun] = false
  })
}

// Obtener la conjugación correcta según el pronombre
const conjugate = (verb, pronoun) => {
  if (!verb) return ''

  const pronounMap = {
    'Я': verb.present_ya,
    'Ты': verb.present_ty,
    'Он/Она': verb.present_on_ona,
    'Мы': verb.present_my,
    'Вы': verb.present_vy,
    'Они': verb.present_oni,
  }

  return pronounMap[pronoun] || ''
}

// Verificar respuesta
const checkAnswer = (pronoun) => {
  if (!currentVerb.value || checkedAnswers[pronoun] !== null) return

  const correctAnswer = conjugate(currentVerb.value, pronoun)
  if (!correctAnswer) return

  checkedAnswers[pronoun] = checkConjugation(userInputs[pronoun], correctAnswer)
}

// Reproducir pronunciación
const playPronunciation = (pronoun) => {
  if (!currentVerb.value) return

  const conjugation = conjugate(currentVerb.value, pronoun)
  if (!conjugation) return

  isPlayingPronoun[pronoun] = true
  speak(pronoun + ' ' + conjugation)

  setTimeout(() => {
    isPlayingPronoun[pronoun] = false
  }, 1000)
}
</script>

