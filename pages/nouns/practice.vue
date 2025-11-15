<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Práctica de Sustantivos</h1>
      <p class="text-gray-600">Practica el género y las formas de los sustantivos rusos</p>
    </div>

    <!-- Sin sustantivos -->
    <div v-if="nouns.length === 0" class="p-8 text-center card">
      <div class="text-gray-500">
        <p class="mb-4 text-xl">Aún no tienes sustantivos para practicar</p>
        <p class="mb-6">Ve a la sección de Sustantivos para agregar algunos</p>
        <NuxtLink to="/nouns" class="inline-block btn-primary">
          Ir a Sustantivos
        </NuxtLink>
      </div>
    </div>

    <!-- Práctica activa -->
    <div v-else class="space-y-6">
      <!-- Sustantivo actual -->
      <div class="bg-gradient-to-r from-pink-50 to-purple-50 p-6 card">
        <div class="text-center">
          <p class="mb-2 text-gray-600 text-lg">Identifica el género del sustantivo:</p>
          <p class="mb-2 font-extrabold text-pink-700 text-5xl">
            {{ currentNoun?.sustantivo || '...' }}
          </p>
          <p class="text-gray-500 text-sm">
            Singular: {{ currentNoun?.singular }} | Plural: {{ currentNoun?.plural }}
          </p>
        </div>
      </div>

      <!-- Opciones de género -->
      <div class="p-6 card">
        <h3 class="mb-4 font-semibold text-gray-700 text-xl">Selecciona el género:</h3>
        <div class="gap-4 grid md:grid-cols-3">
          <button
            @click="checkGender('masculine')"
            :disabled="answered"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answered && currentNoun?.gender === 'masculine' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answered && selectedGender === 'masculine' && currentNoun?.gender !== 'masculine' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-blue-50 hover:bg-blue-100 text-blue-700'
            ]"
          >
            Masculino (он)
          </button>
          <button
            @click="checkGender('feminine')"
            :disabled="answered"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answered && currentNoun?.gender === 'feminine' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answered && selectedGender === 'feminine' && currentNoun?.gender !== 'feminine' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-pink-50 hover:bg-pink-100 text-pink-700'
            ]"
          >
            Femenino (она)
          </button>
          <button
            @click="checkGender('neuter')"
            :disabled="answered"
            :class="[
              'p-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105',
              answered && currentNoun?.gender === 'neuter' ? 'bg-green-100 border-2 border-green-500 text-green-700' :
              answered && selectedGender === 'neuter' && currentNoun?.gender !== 'neuter' ? 'bg-red-100 border-2 border-red-500 text-red-700' :
              'bg-green-50 hover:bg-green-100 text-green-700'
            ]"
          >
            Neutro (оно)
          </button>
        </div>

        <!-- Feedback -->
        <div v-if="answered" class="mt-6 p-4 rounded-lg" :class="isCorrect ? 'bg-green-50' : 'bg-red-50'">
          <p class="font-semibold text-lg" :class="isCorrect ? 'text-green-700' : 'text-red-700'">
            {{ isCorrect ? '¡Correcto! ✓' : '✗ Incorrecto' }}
          </p>
          <p class="mt-2 text-gray-700" v-if="!isCorrect">
            El género correcto es: <strong>{{ genderLabel(currentNoun?.gender) }}</strong>
          </p>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4 mt-6">
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
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// TODO: Cargar sustantivos desde la API cuando esté lista
const nouns = ref([])
const currentNoun = ref(null)
const answered = ref(false)
const selectedGender = ref(null)
const isCorrect = ref(false)

const stats = reactive({
  correct: 0,
  incorrect: 0
})

const accuracy = computed(() => {
  const total = stats.correct + stats.incorrect
  return total > 0 ? Math.round((stats.correct / total) * 100) : 0
})

onMounted(() => {
  // TODO: fetchNouns desde la API
  // Por ahora, datos de ejemplo
  nouns.value = [
    { id: 1, sustantivo: 'стол', singular: 'стол', plural: 'столы', gender: 'masculine' },
    { id: 2, sustantivo: 'вода', singular: 'вода', plural: 'воды', gender: 'feminine' },
    { id: 3, sustantivo: 'окно', singular: 'окно', plural: 'окна', gender: 'neuter' },
  ]

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

const checkGender = (gender) => {
  if (answered.value) return

  selectedGender.value = gender
  answered.value = true
  isCorrect.value = gender === currentNoun.value?.gender

  if (isCorrect.value) {
    stats.correct++
  } else {
    stats.incorrect++
  }
}

const nextNoun = () => {
  if (nouns.value.length === 0) return

  answered.value = false
  selectedGender.value = null
  isCorrect.value = false

  const randomIndex = Math.floor(Math.random() * nouns.value.length)
  currentNoun.value = nouns.value[randomIndex]
}

const resetPractice = () => {
  stats.correct = 0
  stats.incorrect = 0
  answered.value = false
  selectedGender.value = null
  isCorrect.value = false
  nextNoun()
}
</script>

