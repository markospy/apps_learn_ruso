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

    <!-- Ventana de selección de práctica -->
    <div v-if="!practiceStarted && !loading && nouns.length > 0" class="p-6 card">
      <h2 class="mb-6 font-semibold text-gray-800 text-2xl">Selecciona tu práctica</h2>

      <!-- Tipos de práctica -->
      <div class="mb-6">
        <h3 class="mb-3 font-medium text-gray-700 text-lg">Tipo de Ejercicio</h3>
        <div class="gap-3 grid grid-cols-1 md:grid-cols-2">
          <button
            @click="startPractice('gender')"
            class="bg-blue-50 hover:bg-blue-100 p-4 border-2 border-blue-200 rounded-lg text-left transition-colors"
          >
            <h4 class="mb-1 font-semibold text-blue-800">Género</h4>
            <p class="text-blue-600 text-sm">Identifica el género de los sustantivos</p>
          </button>
          <button
            @click="startPractice('plural')"
            class="bg-purple-50 hover:bg-purple-100 p-4 border-2 border-purple-200 rounded-lg text-left transition-colors"
          >
            <h4 class="mb-1 font-semibold text-purple-800">Plural</h4>
            <p class="text-purple-600 text-sm">Practica la formación del plural</p>
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
                <h4 class="mb-1 font-semibold">Todos los Sustantivos</h4>
                <p class="opacity-90 text-sm">{{ nouns.length }} sustantivos disponibles</p>
              </div>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </button>

          <div v-if="nounGroups.length > 0">
            <p class="mb-2 font-medium text-gray-600 text-sm">O selecciona un grupo:</p>
            <div class="space-y-2">
              <button
                v-for="group in nounGroups"
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
                    <p class="opacity-90 text-sm">{{ getGroupNounCount(group.id) }} sustantivos</p>
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

    <!-- Sin sustantivos -->
    <div v-else-if="nouns.length === 0 && !loading" class="p-8 text-center card">
      <div class="text-gray-500">
        <p class="mb-4 text-xl">Aún no hay sustantivos disponibles para practicar</p>
        <p class="mb-6">Los sustantivos se cargan desde la API</p>
        <NuxtLink to="/nouns" class="inline-block btn-primary">
          Ver Sustantivos
        </NuxtLink>
      </div>
    </div>

    <!-- Práctica activa -->
    <div v-else-if="practiceStarted" class="space-y-6">
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
const { groups: nounGroups, fetchGroups: fetchNounGroups, fetchGroup: fetchNounGroup } = useNounGroups()
const { checkAnswer: checkConjugation } = useConjugation()

// Estado local
const practiceStarted = ref(false)
const selectedPracticeType = ref('gender')
const selectedSource = ref('all')
const practiceNouns = ref([])
const currentNoun = ref(null)
const practiceMode = ref('gender')
const groupDetailsCache = ref({})

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

// Obtener cantidad de sustantivos en un grupo
const getGroupNounCount = (groupId) => {
  const cacheKey = `nouns-${groupId}`
  if (groupDetailsCache.value[cacheKey]) {
    return (groupDetailsCache.value[cacheKey].nouns || []).length
  }
  return 0
}

// Iniciar práctica
const startPractice = (type) => {
  selectedPracticeType.value = type
  practiceMode.value = type
}

// Confirmar inicio de práctica
const confirmStartPractice = async () => {
  if (!selectedSource.value || !selectedPracticeType.value) return

  // Cargar sustantivos según la fuente seleccionada
  if (selectedSource.value === 'all') {
    practiceNouns.value = nouns.value
  } else if (selectedSource.value.startsWith('group-')) {
    const groupId = parseInt(selectedSource.value.replace('group-', ''))
    const cacheKey = `nouns-${groupId}`

    if (!groupDetailsCache.value[cacheKey]) {
      const group = await fetchNounGroup(groupId)
      if (group) {
        groupDetailsCache.value[cacheKey] = group
        practiceNouns.value = group.nouns || []
      } else {
        alert('Error al cargar el grupo')
        return
      }
    } else {
      practiceNouns.value = groupDetailsCache.value[cacheKey].nouns || []
    }
  }

  if (practiceNouns.value.length === 0) {
    alert('No hay sustantivos disponibles para practicar')
    return
  }

  practiceStarted.value = true
  nextNoun()
}

// Cargar sustantivos y grupos al montar
onMounted(async () => {
  await Promise.all([
    fetchNouns(),
    fetchNounGroups()
  ])
})

// Siguiente sustantivo
const nextNoun = () => {
  // Resetear estado de género
  answeredGender.value = false
  selectedGender.value = null
  isCorrectGender.value = false

  // Resetear estado de plural
  answeredPlural.value = false
  userPluralInput.value = ''
  isCorrectPlural.value = false

  if (practiceNouns.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * practiceNouns.value.length)
    currentNoun.value = practiceNouns.value[randomIndex]
  } else if (nouns.value.length > 0) {
    currentNoun.value = selectRandomNoun()
  }
}

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
