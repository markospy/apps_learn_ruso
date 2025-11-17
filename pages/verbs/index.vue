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
      <div v-else class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="verb in verbs"
          :key="verb.id"
          class="relative bg-white hover:shadow-md p-3 border border-gray-200 rounded-lg transition-shadow"
        >
          <!-- Botón de detalles en esquina superior derecha -->
          <button
            @click="openDetailsModal(verb)"
            class="top-2 right-2 absolute bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>

          <div class="flex gap-3">
            <!-- Placeholder para imagen -->
            <div class="flex flex-shrink-0 justify-center items-center bg-gray-100 rounded-lg w-[60px] h-[60px]">
              <span class="text-gray-400 text-xs">IMG</span>
            </div>

            <!-- Contenido -->
            <div class="flex-1 pr-8 min-w-0">
              <p class="font-semibold text-gray-800 text-base truncate">
                {{ verb.imperfective?.infinitive?.word?.word || 'N/A' }}
              </p>
              <p v-if="getPhonetics(verb)" class="mt-1 text-gray-500 text-xs">
                [{{ getPhonetics(verb) }}]
              </p>
              <p v-if="getSpanishTranslation(verb)" class="mt-1 text-gray-600 text-sm truncate">
                {{ getSpanishTranslation(verb) }}
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

    <!-- Modal de detalles del verbo -->
    <div
      v-if="showDetailsModal && selectedVerb"
      class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      @click.self="closeDetailsModal"
    >
      <div class="bg-white mx-4 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-800 text-xl">
            {{ isEditing ? 'Editar Verbo' : 'Detalles del Verbo' }}
          </h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
            :disabled="isEditing"
          >
            ×
          </button>
        </div>

        <div class="space-y-6">
          <!-- Información básica -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="mb-3 font-semibold text-gray-700">Información Básica</h4>
            <div class="gap-4 grid grid-cols-2">
              <div>
                <p class="text-gray-600 text-sm">Infinitivo (Imperfectivo)</p>
                <input
                  v-if="isEditing"
                  v-model="editedVerb.imperfective.infinitive.word.word"
                  class="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  type="text"
                />
                <template v-else>
                  <p class="font-semibold text-gray-800">
                    {{ selectedVerb.imperfective?.infinitive?.word?.word || 'N/A' }}
                  </p>
                  <p v-if="selectedVerb.imperfective?.infinitive?.word?.phonetics" class="mt-1 text-gray-500 text-xs">
                    [{{ selectedVerb.imperfective?.infinitive?.word?.phonetics }}]
                  </p>
                </template>
              </div>
              <div v-if="selectedVerb.perfective?.infinitive?.word?.word || (isEditing && editedVerb?.perfective?.infinitive?.word?.word)">
                <p class="text-gray-600 text-sm">Infinitivo (Perfectivo)</p>
                <input
                  v-if="isEditing"
                  v-model="editedVerb.perfective.infinitive.word.word"
                  class="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  type="text"
                />
                <template v-else>
                  <p class="font-semibold text-gray-800">
                    {{ selectedVerb.perfective?.infinitive?.word?.word }}
                  </p>
                  <p v-if="selectedVerb.perfective?.infinitive?.word?.phonetics" class="mt-1 text-gray-500 text-xs">
                    [{{ selectedVerb.perfective?.infinitive?.word?.phonetics }}]
                  </p>
                </template>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Raíz</p>
                <input
                  v-if="isEditing"
                  v-model="editedVerb.root"
                  class="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  type="text"
                />
                <p v-else class="font-semibold text-gray-800">{{ selectedVerb.root || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Traducciones -->
          <div v-if="getSpanishTranslation(isEditing ? editedVerb : selectedVerb)" class="bg-green-50 p-4 rounded-lg">
            <h4 class="mb-3 font-semibold text-gray-700">Traducción al Español</h4>
            <div class="bg-white p-3 rounded">
              <textarea
                v-if="isEditing"
                v-model="editedVerb.translations[0].es"
                class="px-3 py-2 border border-gray-300 rounded-lg w-full"
                rows="3"
                placeholder="Traducciones separadas por comas"
              ></textarea>
              <p v-else class="text-gray-600">{{ getSpanishTranslation(selectedVerb) }}</p>
            </div>
          </div>

          <!-- Presente (Imperfectivo) -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="mb-3 font-semibold text-gray-700">Presente (Imperfectivo)</h4>
            <div class="gap-3 grid grid-cols-2 md:grid-cols-3">
              <div v-if="selectedVerb.imperfective?.present_tense?.ya">
                <p class="text-gray-600 text-xs">Я</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.ya.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.ya.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.ya.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.present_tense?.ty">
                <p class="text-gray-600 text-xs">Ты</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.ty.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.ty.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.ty.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.present_tense?.on_ona">
                <p class="text-gray-600 text-xs">Он/Она</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.on_ona.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.on_ona.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.on_ona.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.present_tense?.my">
                <p class="text-gray-600 text-xs">Мы</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.my.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.my.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.my.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.present_tense?.vy">
                <p class="text-gray-600 text-xs">Вы</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.vy.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.vy.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.vy.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.present_tense?.oni">
                <p class="text-gray-600 text-xs">Они</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.present_tense.oni.word }}</p>
                <p v-if="selectedVerb.imperfective.present_tense.oni.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.present_tense.oni.phonetics }}]</p>
              </div>
            </div>
          </div>

          <!-- Pasado (Imperfectivo) -->
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="mb-3 font-semibold text-gray-700">Pasado (Imperfectivo)</h4>
            <div class="gap-3 grid grid-cols-2 md:grid-cols-4">
              <div v-if="selectedVerb.imperfective?.past_tense?.masculine">
                <p class="text-gray-600 text-xs">Masculino</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.past_tense.masculine.word }}</p>
                <p v-if="selectedVerb.imperfective.past_tense.masculine.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.past_tense.masculine.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.past_tense?.feminine">
                <p class="text-gray-600 text-xs">Femenino</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.past_tense.feminine.word }}</p>
                <p v-if="selectedVerb.imperfective.past_tense.feminine.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.past_tense.feminine.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.past_tense?.neuter">
                <p class="text-gray-600 text-xs">Neutro</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.past_tense.neuter.word }}</p>
                <p v-if="selectedVerb.imperfective.past_tense.neuter.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.past_tense.neuter.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.imperfective?.past_tense?.plural">
                <p class="text-gray-600 text-xs">Plural</p>
                <p class="font-semibold">{{ selectedVerb.imperfective.past_tense.plural.word }}</p>
                <p v-if="selectedVerb.imperfective.past_tense.plural.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.imperfective.past_tense.plural.phonetics }}]</p>
              </div>
            </div>
          </div>

          <!-- Futuro (Perfectivo) -->
          <div v-if="selectedVerb.perfective?.future_simple" class="bg-purple-50 p-4 rounded-lg">
            <h4 class="mb-3 font-semibold text-gray-700">Futuro Simple (Perfectivo)</h4>
            <div class="gap-3 grid grid-cols-2 md:grid-cols-3">
              <div v-if="selectedVerb.perfective.future_simple.ya">
                <p class="text-gray-600 text-xs">Я</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.ya.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.ya.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.ya.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.perfective.future_simple.ty">
                <p class="text-gray-600 text-xs">Ты</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.ty.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.ty.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.ty.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.perfective.future_simple.on_ona">
                <p class="text-gray-600 text-xs">Он/Она</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.on_ona.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.on_ona.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.on_ona.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.perfective.future_simple.my">
                <p class="text-gray-600 text-xs">Мы</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.my.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.my.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.my.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.perfective.future_simple.vy">
                <p class="text-gray-600 text-xs">Вы</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.vy.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.vy.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.vy.phonetics }}]</p>
              </div>
              <div v-if="selectedVerb.perfective.future_simple.oni">
                <p class="text-gray-600 text-xs">Они</p>
                <p class="font-semibold">{{ selectedVerb.perfective.future_simple.oni.word }}</p>
                <p v-if="selectedVerb.perfective.future_simple.oni.phonetics" class="text-gray-500 text-xs">[{{ selectedVerb.perfective.future_simple.oni.phonetics }}]</p>
              </div>
            </div>
          </div>

          <!-- Botones de acción (solo para admin/teacher) -->
          <div v-if="canEdit" class="flex justify-end gap-3">
            <button
              v-if="isEditing"
              @click="saveEdit"
              class="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold text-white transition-colors"
            >
              Guardar Cambios
            </button>
            <button
              @click="startEdit"
              class="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-semibold text-white transition-colors"
            >
              {{ isEditing ? 'Cancelar Edición' : 'Iniciar Edición' }}
            </button>
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

const { verbs, loading, fetchVerbs, pagination } = useVerbs()
const { speak, stop, startRecording, recordingResults, isRecording, isSpeechRecognitionSupported } = usePronunciation()
const { user } = useAuth()

const isPlaying = ref(null)
const showDetailsModal = ref(false)
const selectedVerb = ref(null)
const isEditing = ref(false)
const editedVerb = ref(null)
const canEdit = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'teacher'
})

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
  if (!verb) return ''
  return verb.imperfective?.infinitive?.word?.phonetics || verb.imperfective?.infinitive?.phonetics || ''
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

// Abrir modal de detalles
const openDetailsModal = (verb) => {
  selectedVerb.value = verb
  showDetailsModal.value = true
}

// Cerrar modal de detalles
const closeDetailsModal = () => {
  if (isEditing.value) {
    if (confirm('¿Estás seguro de cerrar? Se perderán los cambios no guardados.')) {
      isEditing.value = false
      editedVerb.value = null
      showDetailsModal.value = false
      selectedVerb.value = null
    }
  } else {
    showDetailsModal.value = false
    selectedVerb.value = null
  }
}

// Iniciar edición
const startEdit = () => {
  if (isEditing.value) {
    // Cancelar edición
    isEditing.value = false
    editedVerb.value = null
  } else {
    // Iniciar edición
    isEditing.value = true
    // Crear copia del verbo para editar
    editedVerb.value = JSON.parse(JSON.stringify(selectedVerb.value))
  }
}

// Guardar cambios
const saveEdit = async () => {
  // TODO: Implementar guardado cuando los endpoints estén disponibles
  try {
    // Por ahora solo mostramos un mensaje
    alert('La funcionalidad de guardado estará disponible próximamente cuando los endpoints de edición estén listos.')

    // Cuando esté disponible, aquí iría:
    // const api = createApiClient()
    // await api.put(`/verbs/${selectedVerb.value.id}`, editedVerb.value)
    // selectedVerb.value = editedVerb.value
    // isEditing.value = false
    // editedVerb.value = null
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Error al guardar los cambios')
  }
}

// Cargar verbos al montar
onMounted(() => {
  fetchVerbs()
})
</script>
