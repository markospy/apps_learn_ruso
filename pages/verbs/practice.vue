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

    <!-- Ventana de selección de práctica -->
    <div v-if="!practiceStarted && !loading && verbs.length > 0" class="p-6 card">
      <h2 class="mb-6 font-semibold text-gray-800 text-2xl">Selecciona tu práctica</h2>

      <!-- Tipos de práctica -->
      <div class="mb-6">
        <h3 class="mb-3 font-medium text-gray-700 text-lg">Tipo de Ejercicio</h3>
        <div class="gap-3 grid grid-cols-1 md:grid-cols-2">
          <button
            @click="startPractice('conjugation')"
            class="bg-blue-50 hover:bg-blue-100 p-4 border-2 border-blue-200 rounded-lg text-left transition-colors"
          >
            <h4 class="mb-1 font-semibold text-blue-800">Conjugación</h4>
            <p class="text-blue-600 text-sm">Practica la conjugación de verbos en diferentes tiempos</p>
          </button>
          <button
            @click="startPractice('vocabulary')"
            class="bg-green-50 hover:bg-green-100 p-4 border-2 border-green-200 rounded-lg text-left transition-colors"
          >
            <h4 class="mb-1 font-semibold text-green-800">Vocabulario</h4>
            <p class="text-green-600 text-sm">Aprende y memoriza verbos con sus traducciones</p>
          </button>
        </div>
      </div>

      <!-- Selección de fuente -->
      <div class="mb-6">
        <h3 class="mb-3 font-medium text-gray-700 text-lg">¿Con qué quieres practicar?</h3>
        <div class="space-y-3">
          <button
            @click="selectedSource = 'all'"
            :class="[
              'w-full p-4 rounded-lg text-left transition-colors',
              selectedSource === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            ]"
          >
            <div class="flex justify-between items-center">
              <div>
                <h4 class="mb-1 font-semibold">Todos los Verbos</h4>
                <p class="opacity-90 text-sm">{{ verbs.length }} verbos disponibles</p>
              </div>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </button>

          <div v-if="verbGroups.length > 0">
            <p class="mb-2 font-medium text-gray-600 text-sm">O selecciona un grupo:</p>
            <div class="space-y-2">
              <button
                v-for="group in verbGroups"
                :key="group.id"
                @click="selectedSource = `group-${group.id}`"
                :class="[
                  'w-full p-3 rounded-lg text-left transition-colors',
                  selectedSource === `group-${group.id}`
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                ]"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h4 class="font-semibold">{{ group.name_group }}</h4>
                    <p class="opacity-90 text-sm">{{ getGroupVerbCount(group.id) }} verbos</p>
                  </div>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="confirmStartPractice"
        :disabled="!selectedSource || !selectedPracticeType"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 py-3 rounded-lg w-full font-semibold text-white transition-colors disabled:cursor-not-allowed"
      >
        Comenzar Práctica
      </button>
    </div>

    <!-- Sin verbos -->
    <div v-else-if="verbs.length === 0 && !loading" class="p-8 text-center card">
      <div class="text-gray-500">
        <p class="mb-4 text-xl">Aún no hay verbos disponibles para practicar</p>
        <p class="mb-6">Los verbos se cargan desde la API</p>
        <NuxtLink to="/verbs" class="inline-block btn-primary">
          Ver Verbos
        </NuxtLink>
      </div>
    </div>

    <!-- Práctica activa -->
    <div v-else-if="practiceStarted" class="space-y-6">
      <!-- Verbo actual -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 card">
        <div class="text-center">
          <p class="mb-2 text-gray-600 text-lg">Conjuga el verbo:</p>
          <p class="mb-2 font-extrabold text-blue-700 text-5xl">
            {{ currentVerb?.imperfective?.infinitive?.word?.word || '...' }}
          </p>
          <p class="text-gray-500">
            Conjugación {{ currentVerb?.conjugationType }}
          </p>
        </div>
      </div>

      <!-- Selector de tiempo verbal -->
      <div class="bg-white shadow-md p-4 rounded-lg card">
        <label class="block mb-2 font-semibold text-gray-700 text-lg">
          Tiempo Verbal
        </label>
        <div class="gap-2 grid grid-cols-2 md:grid-cols-4">
          <button
            @click="selectedTense = 'present'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedTense === 'present'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Presente
          </button>
          <button
            @click="selectedTense = 'past'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedTense === 'past'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Pasado
          </button>
          <button
            @click="selectedTense = 'future'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedTense === 'future'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Futuro
          </button>
          <button
            @click="selectedTense = 'imperative'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedTense === 'imperative'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Imperativo
          </button>
        </div>
      </div>

      <!-- Formulario de conjugaciones -->
      <div class="p-6 card">
        <div class="space-y-4">
          <!-- Presente -->
          <template v-if="selectedTense === 'present'">
            <div
              v-for="pronoun in Object.keys(PRONOUNS)"
              :key="`present-${pronoun}`"
              class="flex sm:flex-row flex-col items-center gap-3 p-4 rounded-lg transition-colors"
              :class="{
                'bg-green-50 border-2 border-green-300': checkedAnswers[`present-${pronoun}`] === true,
                'bg-red-50 border-2 border-red-300': checkedAnswers[`present-${pronoun}`] === false,
                'bg-gray-50': checkedAnswers[`present-${pronoun}`] === null
              }"
            >
              <div class="flex-shrink-0 w-32 sm:text-left text-center">
                <p class="font-bold text-gray-800 text-lg">{{ pronoun }}</p>
                <p class="text-gray-600 text-sm">{{ getPronounTranslation(pronoun) }}</p>
              </div>
              <button
                @click="playPronunciation(`present-${pronoun}`)"
                :disabled="!currentVerb"
                class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
                title="Escuchar pronunciación"
              >
                <svg v-if="!isPlayingPronoun[`present-${pronoun}`]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                v-model="userInputs[`present-${pronoun}`]"
                :disabled="checkedAnswers[`present-${pronoun}`] !== null"
                @keyup.enter="checkAnswer(`present-${pronoun}`)"
                placeholder="Escribe la conjugación"
                class="flex-grow conjugation-input"
                :class="{
                  'correct': checkedAnswers[`present-${pronoun}`] === true,
                  'incorrect': checkedAnswers[`present-${pronoun}`] === false
                }"
              />
              <button
                @click="checkAnswer(`present-${pronoun}`)"
                :disabled="!currentVerb || checkedAnswers[`present-${pronoun}`] !== null || !userInputs[`present-${pronoun}`]?.trim()"
                class="flex-shrink-0 px-6 py-2 btn-primary"
              >
                {{ checkedAnswers[`present-${pronoun}`] === null ? 'Comprobar' : checkedAnswers[`present-${pronoun}`] ? '✓' : '✗' }}
              </button>
              <div v-if="checkedAnswers[`present-${pronoun}`] !== null" class="flex-shrink-0 min-w-[200px]">
                <p v-if="checkedAnswers[`present-${pronoun}`]" class="font-semibold text-green-600">¡Correcto!</p>
                <p v-else class="font-semibold text-red-600">
                  Correcto: <span class="font-bold">{{ conjugate(`present-${pronoun}`) }}</span>
                </p>
              </div>
            </div>
          </template>

          <!-- Pasado -->
          <template v-if="selectedTense === 'past'">
            <div
              v-for="gender in ['masculine', 'feminine', 'neuter', 'plural']"
              :key="`past-${gender}`"
              class="flex sm:flex-row flex-col items-center gap-3 p-4 rounded-lg transition-colors"
              :class="{
                'bg-green-50 border-2 border-green-300': checkedAnswers[`past-${gender}`] === true,
                'bg-red-50 border-2 border-red-300': checkedAnswers[`past-${gender}`] === false,
                'bg-gray-50': checkedAnswers[`past-${gender}`] === null
              }"
            >
              <div class="flex-shrink-0 w-32 sm:text-left text-center">
                <p class="font-bold text-gray-800 text-lg">{{ getGenderLabel(gender) }}</p>
              </div>
              <button
                @click="playPronunciation(`past-${gender}`)"
                :disabled="!currentVerb"
                class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
                title="Escuchar pronunciación"
              >
                <svg v-if="!isPlayingPronoun[`past-${gender}`]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                v-model="userInputs[`past-${gender}`]"
                :disabled="checkedAnswers[`past-${gender}`] !== null"
                @keyup.enter="checkAnswer(`past-${gender}`)"
                placeholder="Escribe la conjugación"
                class="flex-grow conjugation-input"
                :class="{
                  'correct': checkedAnswers[`past-${gender}`] === true,
                  'incorrect': checkedAnswers[`past-${gender}`] === false
                }"
              />
              <button
                @click="checkAnswer(`past-${gender}`)"
                :disabled="!currentVerb || checkedAnswers[`past-${gender}`] !== null || !userInputs[`past-${gender}`]?.trim()"
                class="flex-shrink-0 px-6 py-2 btn-primary"
              >
                {{ checkedAnswers[`past-${gender}`] === null ? 'Comprobar' : checkedAnswers[`past-${gender}`] ? '✓' : '✗' }}
              </button>
              <div v-if="checkedAnswers[`past-${gender}`] !== null" class="flex-shrink-0 min-w-[200px]">
                <p v-if="checkedAnswers[`past-${gender}`]" class="font-semibold text-green-600">¡Correcto!</p>
                <p v-else class="font-semibold text-red-600">
                  Correcto: <span class="font-bold">{{ conjugate(`past-${gender}`) }}</span>
                </p>
              </div>
            </div>
          </template>

          <!-- Futuro -->
          <template v-if="selectedTense === 'future'">
            <div
              v-for="pronoun in Object.keys(PRONOUNS)"
              :key="`future-${pronoun}`"
              class="flex sm:flex-row flex-col items-center gap-3 p-4 rounded-lg transition-colors"
              :class="{
                'bg-green-50 border-2 border-green-300': checkedAnswers[`future-${pronoun}`] === true,
                'bg-red-50 border-2 border-red-300': checkedAnswers[`future-${pronoun}`] === false,
                'bg-gray-50': checkedAnswers[`future-${pronoun}`] === null
              }"
            >
              <div class="flex-shrink-0 w-32 sm:text-left text-center">
                <p class="font-bold text-gray-800 text-lg">{{ pronoun }}</p>
                <p class="text-gray-600 text-sm">{{ getPronounTranslation(pronoun) }}</p>
              </div>
              <button
                @click="playPronunciation(`future-${pronoun}`)"
                :disabled="!currentVerb"
                class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
                title="Escuchar pronunciación"
              >
                <svg v-if="!isPlayingPronoun[`future-${pronoun}`]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                v-model="userInputs[`future-${pronoun}`]"
                :disabled="checkedAnswers[`future-${pronoun}`] !== null"
                @keyup.enter="checkAnswer(`future-${pronoun}`)"
                placeholder="Escribe la conjugación"
                class="flex-grow conjugation-input"
                :class="{
                  'correct': checkedAnswers[`future-${pronoun}`] === true,
                  'incorrect': checkedAnswers[`future-${pronoun}`] === false
                }"
              />
              <button
                @click="checkAnswer(`future-${pronoun}`)"
                :disabled="!currentVerb || checkedAnswers[`future-${pronoun}`] !== null || !userInputs[`future-${pronoun}`]?.trim()"
                class="flex-shrink-0 px-6 py-2 btn-primary"
              >
                {{ checkedAnswers[`future-${pronoun}`] === null ? 'Comprobar' : checkedAnswers[`future-${pronoun}`] ? '✓' : '✗' }}
              </button>
              <div v-if="checkedAnswers[`future-${pronoun}`] !== null" class="flex-shrink-0 min-w-[200px]">
                <p v-if="checkedAnswers[`future-${pronoun}`]" class="font-semibold text-green-600">¡Correcto!</p>
                <p v-else class="font-semibold text-red-600">
                  Correcto: <span class="font-bold">{{ conjugate(`future-${pronoun}`) }}</span>
                </p>
              </div>
            </div>
          </template>

          <!-- Imperativo -->
          <template v-if="selectedTense === 'imperative'">
            <div
              v-for="form in ['singular', 'plural']"
              :key="`imperative-${form}`"
              class="flex sm:flex-row flex-col items-center gap-3 p-4 rounded-lg transition-colors"
              :class="{
                'bg-green-50 border-2 border-green-300': checkedAnswers[`imperative-${form}`] === true,
                'bg-red-50 border-2 border-red-300': checkedAnswers[`imperative-${form}`] === false,
                'bg-gray-50': checkedAnswers[`imperative-${form}`] === null
              }"
            >
              <div class="flex-shrink-0 w-32 sm:text-left text-center">
                <p class="font-bold text-gray-800 text-lg">{{ form === 'singular' ? 'Singular' : 'Plural' }}</p>
              </div>
              <button
                @click="playPronunciation(`imperative-${form}`)"
                :disabled="!currentVerb"
                class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
                title="Escuchar pronunciación"
              >
                <svg v-if="!isPlayingPronoun[`imperative-${form}`]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                v-model="userInputs[`imperative-${form}`]"
                :disabled="checkedAnswers[`imperative-${form}`] !== null"
                @keyup.enter="checkAnswer(`imperative-${form}`)"
                placeholder="Escribe la conjugación"
                class="flex-grow conjugation-input"
                :class="{
                  'correct': checkedAnswers[`imperative-${form}`] === true,
                  'incorrect': checkedAnswers[`imperative-${form}`] === false
                }"
              />
              <button
                @click="checkAnswer(`imperative-${form}`)"
                :disabled="!currentVerb || checkedAnswers[`imperative-${form}`] !== null || !userInputs[`imperative-${form}`]?.trim()"
                class="flex-shrink-0 px-6 py-2 btn-primary"
              >
                {{ checkedAnswers[`imperative-${form}`] === null ? 'Comprobar' : checkedAnswers[`imperative-${form}`] ? '✓' : '✗' }}
              </button>
              <div v-if="checkedAnswers[`imperative-${form}`] !== null" class="flex-shrink-0 min-w-[200px]">
                <p v-if="checkedAnswers[`imperative-${form}`]" class="font-semibold text-green-600">¡Correcto!</p>
                <p v-else class="font-semibold text-red-600">
                  Correcto: <span class="font-bold">{{ conjugate(`imperative-${form}`) }}</span>
                </p>
              </div>
            </div>
          </template>
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
const { groups: verbGroups, fetchGroups: fetchVerbGroups, fetchGroup: fetchVerbGroup } = useVerbGroups()
const { PRONOUNS, getPronounTranslation, checkAnswer: checkConjugation } = useConjugation()
const { speak, stop, transliterateToSpanish } = usePronunciation()

// Estado local
const practiceStarted = ref(false)
const selectedPracticeType = ref('conjugation')
const selectedSource = ref('all')
const practiceVerbs = ref([])
const currentVerb = ref(null)
const selectedTense = ref('present')
const userInputs = reactive({})
const checkedAnswers = reactive({})
const isPlayingPronoun = reactive({})
const groupDetailsCache = ref({})

// Inicializar todos los campos
const initializeFields = () => {
  try {
    if (!PRONOUNS || !userInputs || !checkedAnswers || !isPlayingPronoun) {
      console.warn('initializeFields: Algunos objetos no están disponibles', { PRONOUNS, userInputs, checkedAnswers, isPlayingPronoun })
      return
    }

    // Presente
    if (PRONOUNS && typeof PRONOUNS === 'object') {
      Object.keys(PRONOUNS).forEach(pronoun => {
        userInputs[`present-${pronoun}`] = ''
        checkedAnswers[`present-${pronoun}`] = null
        isPlayingPronoun[`present-${pronoun}`] = false
      })
    }

    // Pasado
    const pastGenders = ['masculine', 'feminine', 'neuter', 'plural']
    pastGenders.forEach(gender => {
      userInputs[`past-${gender}`] = ''
      checkedAnswers[`past-${gender}`] = null
      isPlayingPronoun[`past-${gender}`] = false
    })

    // Futuro
    if (PRONOUNS && typeof PRONOUNS === 'object') {
      Object.keys(PRONOUNS).forEach(pronoun => {
        userInputs[`future-${pronoun}`] = ''
        checkedAnswers[`future-${pronoun}`] = null
        isPlayingPronoun[`future-${pronoun}`] = false
      })
    }

    // Imperativo
    const imperativeForms = ['singular', 'plural']
    imperativeForms.forEach(form => {
      userInputs[`imperative-${form}`] = ''
      checkedAnswers[`imperative-${form}`] = null
      isPlayingPronoun[`imperative-${form}`] = false
    })
  } catch (error) {
    console.error('Error en initializeFields:', error)
  }
}

// Obtener cantidad de verbos en un grupo
const getGroupVerbCount = (groupId) => {
  const cacheKey = `verbs-${groupId}`
  if (groupDetailsCache.value[cacheKey]) {
    return (groupDetailsCache.value[cacheKey].verbs || []).length
  }
  return 0
}

// Iniciar práctica
const startPractice = (type) => {
  selectedPracticeType.value = type
}

// Confirmar inicio de práctica
const confirmStartPractice = async () => {
  if (!selectedSource.value || !selectedPracticeType.value) return

  // Cargar verbos según la fuente seleccionada
  if (selectedSource.value === 'all') {
    practiceVerbs.value = verbs.value
  } else if (selectedSource.value.startsWith('group-')) {
    const groupId = parseInt(selectedSource.value.replace('group-', ''))
    const cacheKey = `verbs-${groupId}`

    if (!groupDetailsCache.value[cacheKey]) {
      const group = await fetchVerbGroup(groupId)
      if (group) {
        groupDetailsCache.value[cacheKey] = group
        practiceVerbs.value = group.verbs || []
      } else {
        alert('Error al cargar el grupo')
        return
      }
    } else {
      practiceVerbs.value = groupDetailsCache.value[cacheKey].verbs || []
    }
  }

  if (practiceVerbs.value.length === 0) {
    alert('No hay verbos disponibles para practicar')
    return
  }

  practiceStarted.value = true
  initializeFields()
  newVerb()
}

// Cargar verbos y grupos al montar
onMounted(async () => {
  // Esperar un tick para asegurar que todo esté inicializado
  await nextTick()
  // Inicializar campos después de que PRONOUNS esté disponible
  initializeFields()
  await Promise.all([
    fetchVerbs(),
    fetchVerbGroups()
  ])
})

// Seleccionar nuevo verbo
const newVerb = () => {
  stop()
  resetPractice()
  if (practiceVerbs.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * practiceVerbs.value.length)
    currentVerb.value = practiceVerbs.value[randomIndex]
  } else {
    currentVerb.value = selectRandomVerb()
  }
}

// Reiniciar práctica
const resetPractice = () => {
  stop()
  initializeFields()
}

// Obtener etiqueta de género
const getGenderLabel = (gender) => {
  const labels = {
    masculine: 'Masculino',
    feminine: 'Femenino',
    neuter: 'Neutro',
    plural: 'Plural'
  }
  return labels[gender] || gender
}

// Obtener la conjugación correcta según el tiempo y campo
const conjugate = (fieldKey) => {
  if (!currentVerb.value) return ''

  // Presente (imperfective)
  if (fieldKey.startsWith('present-')) {
    const pronoun = fieldKey.replace('present-', '')
    const pronounMap = {
      'Я': currentVerb.value.imperfective?.present_tense?.ya?.word,
      'Ты': currentVerb.value.imperfective?.present_tense?.ty?.word,
      'Он/Она': currentVerb.value.imperfective?.present_tense?.on_ona?.word,
      'Мы': currentVerb.value.imperfective?.present_tense?.my?.word,
      'Вы': currentVerb.value.imperfective?.present_tense?.vy?.word,
      'Они': currentVerb.value.imperfective?.present_tense?.oni?.word,
    }
    return pronounMap[pronoun] || ''
  }

  // Pasado (imperfective)
  if (fieldKey.startsWith('past-')) {
    const gender = fieldKey.replace('past-', '')
    const genderMap = {
      masculine: currentVerb.value.imperfective?.past_tense?.masculine?.word,
      feminine: currentVerb.value.imperfective?.past_tense?.feminine?.word,
      neuter: currentVerb.value.imperfective?.past_tense?.neuter?.word,
      plural: currentVerb.value.imperfective?.past_tense?.plural?.word,
    }
    return genderMap[gender] || ''
  }

  // Futuro (perfective - future_simple)
  if (fieldKey.startsWith('future-')) {
    const pronoun = fieldKey.replace('future-', '')
    const pronounMap = {
      'Я': currentVerb.value.perfective?.future_simple?.ya?.word,
      'Ты': currentVerb.value.perfective?.future_simple?.ty?.word,
      'Он/Она': currentVerb.value.perfective?.future_simple?.on_ona?.word,
      'Мы': currentVerb.value.perfective?.future_simple?.my?.word,
      'Вы': currentVerb.value.perfective?.future_simple?.vy?.word,
      'Они': currentVerb.value.perfective?.future_simple?.oni?.word,
    }
    return pronounMap[pronoun] || ''
  }

  // Imperativo - Nota: La nueva estructura de la API no incluye imperativo directamente
  // Por ahora retornamos vacío, pero esto podría necesitar ajustes según la API
  if (fieldKey.startsWith('imperative-')) {
    // TODO: Verificar si la API incluye imperativo en alguna parte
    return ''
  }

  return ''
}

// Verificar respuesta
const checkAnswer = (fieldKey) => {
  if (!currentVerb.value || checkedAnswers[fieldKey] !== null) return

  const correctAnswer = conjugate(fieldKey)
  if (!correctAnswer) return

  checkedAnswers[fieldKey] = checkConjugation(userInputs[fieldKey], correctAnswer)
}

// Reproducir pronunciación
const playPronunciation = (fieldKey) => {
  if (!currentVerb.value) return

  const conjugation = conjugate(fieldKey)
  if (!conjugation) return

  isPlayingPronoun[fieldKey] = true

  // Determinar el texto a pronunciar según el tipo de campo
  let textToSpeak = conjugation
  if (fieldKey.startsWith('present-') || fieldKey.startsWith('future-')) {
    const pronoun = fieldKey.replace('present-', '').replace('future-', '')
    textToSpeak = pronoun + ' ' + conjugation
  } else if (fieldKey.startsWith('past-')) {
    const gender = getGenderLabel(fieldKey.replace('past-', ''))
    textToSpeak = conjugation
  } else if (fieldKey.startsWith('imperative-')) {
    const form = fieldKey.replace('imperative-', '') === 'singular' ? 'Singular' : 'Plural'
    textToSpeak = conjugation
  }

  speak(textToSpeak)

  setTimeout(() => {
    isPlayingPronoun[fieldKey] = false
  }, 1000)
}
</script>

