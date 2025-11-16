<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Práctica de Sustantivos</h1>
      <p class="text-gray-600">Practica el género y el plural de los sustantivos rusos</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center card">
      <p class="text-gray-600">Cargando sustantivos...</p>
    </div>

    <!-- Sin sustantivos -->
    <div v-else-if="nouns.length === 0" class="p-8 text-center card">
      <div class="text-gray-500">
        <p class="mb-4 text-xl">Aún no hay sustantivos disponibles para practicar</p>
        <p class="mb-6">Los sustantivos se cargan desde la API</p>
        <NuxtLink to="/nouns" class="inline-block btn-primary">
          Ver Sustantivos
        </NuxtLink>
      </div>
    </div>

    <!-- Práctica activa -->
    <div v-else class="space-y-6">
      <!-- Selector de modo de práctica -->
      <div class="bg-white shadow-md p-4 rounded-lg card">
        <label class="block mb-2 font-semibold text-gray-700 text-lg">
          Modo de Práctica
        </label>
        <div class="gap-2 grid grid-cols-2">
          <button
            @click="practiceMode = 'gender'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              practiceMode === 'gender'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Género
          </button>
          <button
            @click="practiceMode = 'plural'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              practiceMode === 'plural'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            Plural
          </button>
        </div>
      </div>

      <!-- Sustantivo actual -->
      <div class="bg-gradient-to-r from-pink-50 to-purple-50 p-6 card">
        <div class="text-center">
          <p v-if="practiceMode === 'gender'" class="mb-2 text-gray-600 text-lg">
            Identifica el género del sustantivo:
          </p>
          <p v-else class="mb-2 text-gray-600 text-lg">
            Escribe el plural del sustantivo:
          </p>
          <p class="mb-2 font-extrabold text-pink-700 text-5xl">
            {{ currentNoun?.noun || '...' }}
          </p>
          <p v-if="practiceMode === 'gender'" class="text-gray-500 text-sm">
            Singular: {{ currentNoun?.declension?.singular?.nominative?.word || 'N/A' }} |
            Plural: {{ currentNoun?.declension?.plural?.nominative?.word || 'N/A' }}
          </p>
          <p v-else class="text-gray-500 text-sm">
            Singular: {{ currentNoun?.declension?.singular?.nominative?.word || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Práctica de Género -->
      <div v-if="practiceMode === 'gender'" class="p-6 card">
        <h3 class="mb-4 font-semibold text-gray-700 text-xl">Selecciona el género:</h3>
        <div class="gap-4 grid md:grid-cols-3">
          <button
            @click="checkGender('masculine')"
            :disabled="answeredGender"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answeredGender && currentNoun?.gender === 'masculine' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answeredGender && selectedGender === 'masculine' && currentNoun?.gender !== 'masculine' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-blue-50 hover:bg-blue-100 text-blue-700'
            ]"
          >
            Masculino (он)
          </button>
          <button
            @click="checkGender('feminine')"
            :disabled="answeredGender"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answeredGender && currentNoun?.gender === 'feminine' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answeredGender && selectedGender === 'feminine' && currentNoun?.gender !== 'feminine' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-pink-50 hover:bg-pink-100 text-pink-700'
            ]"
          >
            Femenino (она)
          </button>
          <button
            @click="checkGender('neuter')"
            :disabled="answeredGender"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answeredGender && currentNoun?.gender === 'neuter' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answeredGender && selectedGender === 'neuter' && currentNoun?.gender !== 'neuter' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-green-50 hover:bg-green-100 text-green-700'
            ]"
          >
            Neutro (оно)
          </button>
        </div>

        <!-- Feedback -->
        <div v-if="answeredGender" class="mt-6 p-4 rounded-lg" :class="isCorrectGender ? 'bg-green-50' : 'bg-red-50'">
          <p class="font-semibold text-lg" :class="isCorrectGender ? 'text-green-700' : 'text-red-700'">
            {{ isCorrectGender ? '¡Correcto! ✓' : '✗ Incorrecto' }}
          </p>
          <p class="mt-2 text-gray-700" v-if="!isCorrectGender">
            El género correcto es: <strong>{{ genderLabel(currentNoun?.gender) }}</strong>
          </p>
        </div>
      </div>

      <!-- Práctica de Plural -->
      <div v-else class="p-6 card">
        <h3 class="mb-4 font-semibold text-gray-700 text-xl">Escribe el plural:</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <input
              v-model="userPluralInput"
              type="text"
              :disabled="answeredPlural"
              @keyup.enter="checkPlural"
              placeholder="Escribe el plural"
              class="flex-grow conjugation-input"
              :class="{
                'correct': answeredPlural && isCorrectPlural,
                'incorrect': answeredPlural && !isCorrectPlural
              }"
            />
            <button
              @click="checkPlural"
              :disabled="!currentNoun || answeredPlural || !userPluralInput?.trim()"
              class="flex-shrink-0 px-6 py-2 btn-primary"
            >
              {{ answeredPlural ? (isCorrectPlural ? '✓' : '✗') : 'Comprobar' }}
            </button>
          </div>

          <!-- Feedback -->
          <div v-if="answeredPlural" class="p-4 rounded-lg" :class="isCorrectPlural ? 'bg-green-50' : 'bg-red-50'">
            <p class="font-semibold text-lg" :class="isCorrectPlural ? 'text-green-700' : 'text-red-700'">
              {{ isCorrectPlural ? '¡Correcto! ✓' : '✗ Incorrecto' }}
            </p>
            <p class="mt-2 text-gray-700" v-if="!isCorrectPlural">
              El plural correcto es: <strong>{{ currentNoun?.declension?.plural?.nominative?.word || 'N/A' }}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-4">
        <button
          @click="nextNoun"
          class="flex-1 py-3 text-xl btn-primary"
        >
          Siguiente Sustantivo
        </button>
        <button
          @click="resetPractice"
          class="px-6 py-3 btn-secondary"
        >
          Reiniciar
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="bg-gray-50 mt-6 p-4 rounded-lg">
        <div class="gap-4 grid grid-cols-3 text-center">
          <div>
            <p class="font-bold text-gray-800 text-2xl">{{ stats.correct }}</p>
            <p class="text-gray-600 text-sm">Correctas</p>
          </div>
          <div>
            <p class="font-bold text-gray-800 text-2xl">{{ stats.incorrect }}</p>
            <p class="text-gray-600 text-sm">Incorrectas</p>
          </div>
          <div>
            <p class="font-bold text-gray-800 text-2xl">{{ accuracy }}%</p>
            <p class="text-gray-600 text-sm">Precisión</p>
          </div>
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

const { nouns, loading, fetchNouns, selectRandomNoun } = useNouns()
const { checkAnswer: checkConjugation } = useConjugation()

// Estado local
const currentNoun = ref(null)
const practiceMode = ref('gender')

// Estado para práctica de género
const answeredGender = ref(false)
const selectedGender = ref(null)
const isCorrectGender = ref(false)

// Estado para práctica de plural
const answeredPlural = ref(false)
const userPluralInput = ref('')
const isCorrectPlural = ref(false)

const stats = reactive({
  correct: 0,
  incorrect: 0
})

const accuracy = computed(() => {
  const total = stats.correct + stats.incorrect
  return total > 0 ? Math.round((stats.correct / total) * 100) : 0
})

// Cargar sustantivos al montar
onMounted(async () => {
  await fetchNouns()
  if (nouns.value.length > 0) {
    nextNoun()
  }
})

const genderLabel = (gender) => {
  const labels = {
    masculine: 'Masculino (он)',
    feminine: 'Femenino (она)',
    neuter: 'Neutro (оно)'
  }
  return labels[gender] || gender
}

// Verificar género
const checkGender = (gender) => {
  if (answeredGender.value || !currentNoun.value) return

  selectedGender.value = gender
  answeredGender.value = true
  isCorrectGender.value = gender === currentNoun.value.gender

  if (isCorrectGender.value) {
    stats.correct++
  } else {
    stats.incorrect++
  }
}

// Verificar plural
const checkPlural = () => {
  if (answeredPlural.value || !currentNoun.value || !userPluralInput.value.trim()) return

  const correctPlural = currentNoun.value.declension?.plural?.nominative?.word || ''
  answeredPlural.value = true
  isCorrectPlural.value = checkConjugation(userPluralInput.value.trim(), correctPlural)

  if (isCorrectPlural.value) {
    stats.correct++
  } else {
    stats.incorrect++
  }
}

// Siguiente sustantivo
const nextNoun = () => {
  if (nouns.value.length === 0) return

  // Resetear estado de género
  answeredGender.value = false
  selectedGender.value = null
  isCorrectGender.value = false

  // Resetear estado de plural
  answeredPlural.value = false
  userPluralInput.value = ''
  isCorrectPlural.value = false

  currentNoun.value = selectRandomNoun()
}

// Reiniciar práctica
const resetPractice = () => {
  stats.correct = 0
  stats.incorrect = 0

  // Resetear estado de género
  answeredGender.value = false
  selectedGender.value = null
  isCorrectGender.value = false

  // Resetear estado de plural
  answeredPlural.value = false
  userPluralInput.value = ''
  isCorrectPlural.value = false

  nextNoun()
}
</script>
