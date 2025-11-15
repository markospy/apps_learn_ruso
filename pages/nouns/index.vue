<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Sustantivos</h1>
      <p class="text-gray-600">Gestiona tu lista de sustantivos para practicar</p>
    </div>

    <!-- Formulario para agregar sustantivo -->
    <div class="mb-8 p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">Añadir Nuevo Sustantivo</h2>

      <form @submit.prevent="handleAddNoun" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div class="gap-4 grid md:grid-cols-2">
          <div>
            <label for="noun" class="block mb-1 font-medium text-gray-700 text-sm">
              Sustantivo <span class="text-red-500">*</span> (ej: стол)
            </label>
            <input
              id="noun"
              v-model="newNoun.noun"
              type="text"
              required
              class="input-field"
              placeholder="Escribe el sustantivo en ruso"
            />
          </div>

          <div>
            <label for="gender" class="block mb-1 font-medium text-gray-700 text-sm">
              Género <span class="text-red-500">*</span>
            </label>
            <select
              id="gender"
              v-model="newNoun.gender"
              class="input-field"
              required
            >
              <option value="masculine">Masculino (он)</option>
              <option value="feminine">Femenino (она)</option>
              <option value="neuter">Neutro (оно)</option>
            </select>
          </div>
        </div>

        <div class="gap-4 grid md:grid-cols-2">
          <div>
            <label for="singular" class="block mb-1 font-medium text-gray-700 text-sm">
              Singular <span class="text-red-500">*</span>
            </label>
            <input
              id="singular"
              v-model="newNoun.singular"
              type="text"
              required
              class="input-field"
              placeholder="Forma singular"
            />
          </div>

          <div>
            <label for="plural" class="block mb-1 font-medium text-gray-700 text-sm">
              Plural <span class="text-red-500">*</span>
            </label>
            <input
              id="plural"
              v-model="newNoun.plural"
              type="text"
              required
              class="input-field"
              placeholder="Forma plural"
            />
          </div>
        </div>

        <!-- Traducciones -->
        <div>
          <label class="block mb-2 font-medium text-gray-700 text-sm">
            Traducciones
          </label>

          <!-- Formulario para agregar traducción -->
          <div class="flex gap-2 mb-3">
            <select
              v-model="newTranslationLanguage"
              class="flex-shrink-0 w-32 input-field"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="pt">Portugués</option>
            </select>
            <input
              v-model="newTranslationText"
              type="text"
              class="flex-1 input-field"
              placeholder="Escribe la traducción"
              @keyup.enter="addTranslation"
            />
            <button
              type="button"
              @click="addTranslation"
              :disabled="!newTranslationText.trim()"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-4 py-2 rounded-md font-medium text-white text-sm transition-colors disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>

          <!-- Lista de traducciones agregadas -->
          <div v-if="newNoun.translations.length > 0" class="space-y-2">
            <div
              v-for="(translation, index) in newNoun.translations"
              :key="index"
              class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-2 rounded-md"
            >
              <span class="text-gray-700 text-sm">
                <span class="font-semibold">{{ getLanguageLabel(Object.keys(translation)[0]) }}:</span>
                {{ Object.values(translation)[0] }}
              </span>
              <button
                type="button"
                @click="removeTranslation(index)"
                class="hover:bg-red-100 px-2 py-1 rounded font-medium text-red-500 text-sm transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
          <p v-else class="text-gray-500 text-xs italic">No hay traducciones agregadas</p>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex-1 btn-primary"
          >
            {{ loading ? 'Añadiendo...' : 'Añadir Sustantivo' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-6 btn-secondary"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de sustantivos -->
    <div class="p-6 card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-gray-700 text-2xl">
          Mi Lista de Sustantivos ({{ nouns.length }})
        </h2>
        <button
          v-if="nouns.length > 0"
          @click="fetchNouns"
          class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Refrescar
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading && nouns.length === 0" class="py-8 text-gray-500 text-center">
        <p>Cargando sustantivos...</p>
      </div>

      <!-- Sin sustantivos -->
      <div v-else-if="nouns.length === 0" class="py-8 text-gray-500 text-center">
        <p class="text-lg">No hay sustantivos guardados</p>
        <p class="mt-2 text-sm">Usa el formulario de arriba para agregar tu primer sustantivo</p>
      </div>

      <!-- Lista de sustantivos -->
      <div v-else class="space-y-3">
        <div
          v-for="noun in nouns"
          :key="noun.id"
          class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
        >
          <div>
            <p class="font-medium text-gray-800 text-lg">{{ noun.noun }}</p>
            <p class="text-gray-500 text-sm">
              Género: {{ genderLabel(noun.gender) }} | Singular: {{ noun.singular }} | Plural: {{ noun.plural }}
            </p>
          </div>
          <button
            @click="handleDeleteNoun(noun.id)"
            class="hover:bg-red-50 px-4 py-2 rounded font-semibold text-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { nouns, loading, fetchNouns, createNoun, deleteNoun } = useNouns()
const error = ref('')

const newNoun = reactive({
  noun: '',
  gender: 'masculine',
  singular: '',
  plural: '',
  translations: [],
})

const newTranslationLanguage = ref('es')
const newTranslationText = ref('')

// Validar que todos los campos requeridos estén llenos
const isFormValid = computed(() => {
  return !!(
    newNoun.noun.trim() &&
    newNoun.singular.trim() &&
    newNoun.plural.trim()
  )
})

// Obtener etiqueta del idioma
const getLanguageLabel = (langCode) => {
  const labels = {
    es: 'Español',
    en: 'Inglés',
    pt: 'Portugués'
  }
  return labels[langCode] || langCode
}

// Agregar traducción
const addTranslation = () => {
  const text = newTranslationText.value.trim()
  if (!text) return

  const language = newTranslationLanguage.value
  const translationObj = { [language]: text }

  // Verificar que no exista ya una traducción en ese idioma
  const exists = newNoun.translations.some(t => Object.keys(t)[0] === language)
  if (exists) {
    // Si existe, actualizar la traducción existente
    const index = newNoun.translations.findIndex(t => Object.keys(t)[0] === language)
    newNoun.translations[index] = translationObj
  } else {
    // Si no existe, agregar nueva traducción
    newNoun.translations.push(translationObj)
  }

  // Limpiar input
  newTranslationText.value = ''
}

// Eliminar traducción
const removeTranslation = (index) => {
  newNoun.translations.splice(index, 1)
}

// Cargar sustantivos al montar
onMounted(() => {
  fetchNouns()
})

const genderLabel = (gender) => {
  const labels = {
    masculine: 'Masculino (он)',
    feminine: 'Femenino (она)',
    neuter: 'Neutro (оно)'
  }
  return labels[gender] || gender
}

// Resetear formulario
const resetForm = () => {
  newNoun.noun = ''
  newNoun.gender = 'masculine'
  newNoun.singular = ''
  newNoun.plural = ''
  newNoun.translations = []
  newTranslationLanguage.value = 'es'
  newTranslationText.value = ''
  error.value = ''
}

const handleAddNoun = async () => {
  error.value = ''

  // Preparar datos para la API
  const nounData = {
    noun: newNoun.noun.trim(),
    gender: newNoun.gender,
    singular: newNoun.singular.trim(),
    plural: newNoun.plural.trim(),
    translations: newNoun.translations,
  }

  const result = await createNoun(nounData)

  if (result.success) {
    resetForm()
  } else {
    error.value = result.error || 'Error al añadir el sustantivo'
  }
}

const handleDeleteNoun = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este sustantivo?')) return

  const result = await deleteNoun(id)

  if (!result.success) {
    alert(result.error || 'Error al eliminar el sustantivo')
  }
}
</script>

