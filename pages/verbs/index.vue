<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Verbos</h1>
      <p class="text-gray-600">Gestiona tu lista de verbos para practicar</p>
    </div>

    <!-- Lista de verbos -->
    <div class="p-6 card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-gray-700 text-2xl">
          Mi Lista de Verbos ({{ pagination.total }})
        </h2>
        <button
          v-if="verbs.length > 0"
          @click="loadPage(pagination.page)"
          class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Refrescar
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading && verbs.length === 0" class="py-8 text-gray-500 text-center">
        <p>Cargando verbos...</p>
      </div>

      <!-- Sin verbos -->
      <div v-else-if="verbs.length === 0" class="py-8 text-gray-500 text-center">
        <p class="text-lg">No hay verbos disponibles</p>
      </div>

      <!-- Grid de cards compactas -->
      <div v-else class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="verb in verbs"
          :key="verb.id"
          class="bg-white hover:shadow-md p-3 border border-gray-200 rounded-lg transition-shadow"
        >
          <div class="flex gap-3">
            <!-- Placeholder para imagen -->
            <div class="flex flex-shrink-0 justify-center items-center bg-gray-100 rounded-lg w-[60px] h-[60px]">
              <span class="text-gray-400 text-xs">IMG</span>
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 text-base truncate">
                {{ verb.imperfective?.infinitive?.word?.word || 'N/A' }}
              </p>
              <p v-if="getPhonetics(verb)" class="mt-1 text-gray-500 text-xs">
                [{{ getPhonetics(verb) }}]
              </p>
              <p v-if="getSpanishTranslation(verb)" class="mt-1 text-gray-600 text-sm truncate">
                {{ getSpanishTranslation(verb) }}
              </p>
              <p class="mt-1 text-gray-400 text-xs">
                Tipo {{ verb.conjugationType }}
              </p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-2 mt-3">
            <button
              @click="playPronunciation(verb)"
              :disabled="isPlaying === verb.id"
              class="flex flex-1 justify-center items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-2 py-1.5 rounded font-medium text-white text-xs transition-colors disabled:cursor-not-allowed"
              title="Reproducir pronunciación"
            >
              <svg v-if="isPlaying !== verb.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <svg v-else class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ isPlaying === verb.id ? '...' : 'Audio' }}</span>
            </button>
            <button
              @click="checkPronunciation(verb)"
              :disabled="isRecording === verb.id"
              class="flex justify-center items-center bg-green-500 hover:bg-green-600 disabled:bg-gray-300 px-2 py-1.5 rounded font-medium text-white text-xs transition-colors disabled:cursor-not-allowed"
              title="Verificar pronunciación"
            >
              <svg v-if="isRecording !== verb.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <svg v-else class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </button>
          </div>

          <!-- Resultado de pronunciación -->
          <div v-if="recordingResults[verb.id]" class="bg-gray-50 mt-2 p-2 rounded text-xs">
            <p v-if="recordingResults[verb.id].error" class="text-red-600">
              {{ recordingResults[verb.id].error }}
            </p>
            <div v-else>
              <p class="text-gray-600">Reconocido: {{ recordingResults[verb.id].recognized }}</p>
              <p class="font-semibold" :class="recordingResults[verb.id].accuracy >= 70 ? 'text-green-600' : 'text-yellow-600'">
                Precisión: {{ recordingResults[verb.id].accuracy }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
        <button
          @click="loadPage(pagination.page - 1)"
          :disabled="pagination.page === 1 || loading"
          class="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span class="px-4 py-2 text-gray-700">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
        </span>
        <button
          @click="loadPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages || loading"
          class="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { verbs, loading, fetchVerbs, pagination } = useVerbs()
const { speak, stop, startRecording, recordingResults, isRecording, isSpeechRecognitionSupported } = usePronunciation()

const isPlaying = ref(null)

// Obtener texto de traducciones para mostrar
const getTranslationsText = (translations) => {
  if (!translations || translations.length === 0) return ''
  const firstTranslation = translations[0]
  const lang = Object.keys(firstTranslation)[0]
  const texts = firstTranslation[lang]
  if (Array.isArray(texts) && texts.length > 0) {
    return `${lang.toUpperCase()}: ${texts.join(', ')}`
  }
  return ''
}

// Obtener traducción al español
const getSpanishTranslation = (verb) => {
  if (!verb.translations || verb.translations.length === 0) return ''
  const translation = verb.translations[0]
  if (translation.es && Array.isArray(translation.es) && translation.es.length > 0) {
    return translation.es.join(', ')
  }
  return ''
}

// Obtener fonética
const getPhonetics = (verb) => {
  return verb.imperfective?.infinitive?.word?.phonetics || ''
}

// Reproducir pronunciación
const playPronunciation = (verb) => {
  const text = verb.imperfective?.infinitive?.word?.word
  if (!text) return

  stop()
  isPlaying.value = verb.id
  speak(text, { lang: 'ru-RU' })

  setTimeout(() => {
    isPlaying.value = null
  }, 2000)
}

// Verificar pronunciación
const checkPronunciation = async (verb) => {
  const text = verb.imperfective?.infinitive?.word?.word
  if (!text) return

  if (!isSpeechRecognitionSupported()) {
    alert('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.')
    return
  }

  try {
    await startRecording(verb.id, text)
  } catch (error) {
    console.error('Error en reconocimiento:', error)
  }
}

// Cargar página específica
const loadPage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  fetchVerbs(page, pagination.value.perPage)
}

// Cargar verbos al montar
onMounted(() => {
  fetchVerbs()
})
</script>
