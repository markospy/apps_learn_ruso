<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Verbos</h1>
      <p class="text-gray-600">Gestiona tu lista de verbos para practicar</p>
    </div>

    <!-- Formulario para agregar verbo -->
    <div class="mb-8 p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">Añadir Nuevo Verbo</h2>

      <form @submit.prevent="handleAddVerb" class="space-y-6">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Información Básica -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-700 text-lg">Información Básica</h3>
          <div class="gap-4 grid md:grid-cols-2">
            <div>
              <label for="infinitive" class="block mb-1 font-medium text-gray-700 text-sm">
                Infinitivo <span class="text-red-500">*</span> (ej: работать)
              </label>
              <input
                id="infinitive"
                v-model="newVerb.infinitive"
                type="text"
                required
                class="input-field"
                placeholder="Escribe el verbo en infinitivo"
              />
            </div>

            <div>
              <label for="conjugationType" class="block mb-1 font-medium text-gray-700 text-sm">
                Tipo de Conjugación <span class="text-red-500">*</span>
              </label>
              <select
                id="conjugationType"
                v-model.number="newVerb.conjugationType"
                class="input-field"
                required
              >
                <option :value="1">1ª Conjugación</option>
                <option :value="2">2ª Conjugación</option>
              </select>
            </div>

            <div>
              <label for="root" class="block mb-1 font-medium text-gray-700 text-sm">
                Raíz <span class="text-red-500">*</span>
              </label>
              <input
                id="root"
                v-model="newVerb.root"
                type="text"
                required
                class="input-field"
                placeholder="Raíz del verbo"
              />
            </div>

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
              <div v-if="newVerb.translations.length > 0" class="space-y-2">
                <div
                  v-for="(translation, index) in newVerb.translations"
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
          </div>
        </div>

        <!-- Presente -->
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-700 text-lg">Presente</h3>
          <div class="gap-4 grid md:grid-cols-3">
            <div>
              <label for="present_ya" class="block mb-1 font-medium text-gray-700 text-sm">
                Я (yo) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_ya"
                v-model="newVerb.present_ya"
                type="text"
                required
                class="input-field"
                placeholder="работаю"
              />
            </div>
            <div>
              <label for="present_ty" class="block mb-1 font-medium text-gray-700 text-sm">
                Ты (tú) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_ty"
                v-model="newVerb.present_ty"
                type="text"
                required
                class="input-field"
                placeholder="работаешь"
              />
            </div>
            <div>
              <label for="present_on_ona" class="block mb-1 font-medium text-gray-700 text-sm">
                Он/Она (él/ella) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_on_ona"
                v-model="newVerb.present_on_ona"
                type="text"
                required
                class="input-field"
                placeholder="работает"
              />
            </div>
            <div>
              <label for="present_my" class="block mb-1 font-medium text-gray-700 text-sm">
                Мы (nosotros) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_my"
                v-model="newVerb.present_my"
                type="text"
                required
                class="input-field"
                placeholder="работаем"
              />
            </div>
            <div>
              <label for="present_vy" class="block mb-1 font-medium text-gray-700 text-sm">
                Вы (vosotros/ustedes) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_vy"
                v-model="newVerb.present_vy"
                type="text"
                required
                class="input-field"
                placeholder="работаете"
              />
            </div>
            <div>
              <label for="present_oni" class="block mb-1 font-medium text-gray-700 text-sm">
                Они (ellos) <span class="text-red-500">*</span>
              </label>
              <input
                id="present_oni"
                v-model="newVerb.present_oni"
                type="text"
                required
                class="input-field"
                placeholder="работают"
              />
            </div>
          </div>
        </div>

        <!-- Pasado -->
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-700 text-lg">Pasado</h3>
          <div class="gap-4 grid md:grid-cols-2">
            <div>
              <label for="past_masculine" class="block mb-1 font-medium text-gray-700 text-sm">
                Masculino <span class="text-red-500">*</span>
              </label>
              <input
                id="past_masculine"
                v-model="newVerb.past_masculine"
                type="text"
                required
                class="input-field"
                placeholder="работал"
              />
            </div>
            <div>
              <label for="past_feminine" class="block mb-1 font-medium text-gray-700 text-sm">
                Femenino <span class="text-red-500">*</span>
              </label>
              <input
                id="past_feminine"
                v-model="newVerb.past_feminine"
                type="text"
                required
                class="input-field"
                placeholder="работала"
              />
            </div>
            <div>
              <label for="past_neuter" class="block mb-1 font-medium text-gray-700 text-sm">
                Neutro <span class="text-red-500">*</span>
              </label>
              <input
                id="past_neuter"
                v-model="newVerb.past_neuter"
                type="text"
                required
                class="input-field"
                placeholder="работало"
              />
            </div>
            <div>
              <label for="past_plural" class="block mb-1 font-medium text-gray-700 text-sm">
                Plural <span class="text-red-500">*</span>
              </label>
              <input
                id="past_plural"
                v-model="newVerb.past_plural"
                type="text"
                required
                class="input-field"
                placeholder="работали"
              />
            </div>
          </div>
        </div>

        <!-- Futuro -->
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-700 text-lg">Futuro</h3>
          <div class="gap-4 grid md:grid-cols-3">
            <div>
              <label for="future_ya" class="block mb-1 font-medium text-gray-700 text-sm">
                Я (yo) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_ya"
                v-model="newVerb.future_ya"
                type="text"
                required
                class="input-field"
                placeholder="буду работать"
              />
            </div>
            <div>
              <label for="future_ty" class="block mb-1 font-medium text-gray-700 text-sm">
                Ты (tú) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_ty"
                v-model="newVerb.future_ty"
                type="text"
                required
                class="input-field"
                placeholder="будешь работать"
              />
            </div>
            <div>
              <label for="future_on_ona" class="block mb-1 font-medium text-gray-700 text-sm">
                Он/Она (él/ella) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_on_ona"
                v-model="newVerb.future_on_ona"
                type="text"
                required
                class="input-field"
                placeholder="будет работать"
              />
            </div>
            <div>
              <label for="future_my" class="block mb-1 font-medium text-gray-700 text-sm">
                Мы (nosotros) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_my"
                v-model="newVerb.future_my"
                type="text"
                required
                class="input-field"
                placeholder="будем работать"
              />
            </div>
            <div>
              <label for="future_vy" class="block mb-1 font-medium text-gray-700 text-sm">
                Вы (vosotros/ustedes) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_vy"
                v-model="newVerb.future_vy"
                type="text"
                required
                class="input-field"
                placeholder="будете работать"
              />
            </div>
            <div>
              <label for="future_oni" class="block mb-1 font-medium text-gray-700 text-sm">
                Они (ellos) <span class="text-red-500">*</span>
              </label>
              <input
                id="future_oni"
                v-model="newVerb.future_oni"
                type="text"
                required
                class="input-field"
                placeholder="будут работать"
              />
            </div>
          </div>
        </div>

        <!-- Imperativo -->
        <div class="bg-orange-50 p-4 rounded-lg">
          <h3 class="mb-4 font-semibold text-gray-700 text-lg">Imperativo</h3>
          <div class="gap-4 grid md:grid-cols-2">
            <div>
              <label for="imperative_singular" class="block mb-1 font-medium text-gray-700 text-sm">
                Singular <span class="text-red-500">*</span>
              </label>
              <input
                id="imperative_singular"
                v-model="newVerb.imperative_singular"
                type="text"
                required
                class="input-field"
                placeholder="работай"
              />
            </div>
            <div>
              <label for="imperative_plural" class="block mb-1 font-medium text-gray-700 text-sm">
                Plural <span class="text-red-500">*</span>
              </label>
              <input
                id="imperative_plural"
                v-model="newVerb.imperative_plural"
                type="text"
                required
                class="input-field"
                placeholder="работайте"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex-1 btn-primary"
          >
            {{ loading ? 'Añadiendo...' : 'Añadir Verbo' }}
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

    <!-- Lista de verbos -->
    <div class="p-6 card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-gray-700 text-2xl">
          Mi Lista de Verbos ({{ verbs.length }})
        </h2>
        <button
          v-if="verbs.length > 0"
          @click="fetchVerbs"
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
        <p class="text-lg">No hay verbos guardados</p>
        <p class="mt-2 text-sm">Usa el formulario de arriba para agregar tu primer verbo</p>
      </div>

      <!-- Lista de verbos -->
      <div v-else class="space-y-3">
        <div
          v-for="verb in verbs"
          :key="verb.id"
          class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
        >
          <div>
            <p class="font-medium text-gray-800 text-lg">{{ verb.infinitive }}</p>
            <p class="text-gray-500 text-sm">
              Conjugación: {{ verb.conjugationType }} | Raíz: {{ verb.root }}
            </p>
          </div>
          <button
            @click="handleDeleteVerb(verb.id)"
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

const { verbs, loading, fetchVerbs, createVerb, deleteVerb } = useVerbs()

const newVerb = reactive({
  infinitive: '',
  conjugationType: 1,
  root: '',
  translations: [],
  present_ya: '',
  present_ty: '',
  present_on_ona: '',
  present_my: '',
  present_vy: '',
  present_oni: '',
  past_masculine: '',
  past_feminine: '',
  past_neuter: '',
  past_plural: '',
  future_ya: '',
  future_ty: '',
  future_on_ona: '',
  future_my: '',
  future_vy: '',
  future_oni: '',
  imperative_singular: '',
  imperative_plural: '',
})

const newTranslationLanguage = ref('es')
const newTranslationText = ref('')
const error = ref('')

// Validar que todos los campos requeridos estén llenos
const isFormValid = computed(() => {
  return !!(
    newVerb.infinitive.trim() &&
    newVerb.root.trim() &&
    newVerb.present_ya.trim() &&
    newVerb.present_ty.trim() &&
    newVerb.present_on_ona.trim() &&
    newVerb.present_my.trim() &&
    newVerb.present_vy.trim() &&
    newVerb.present_oni.trim() &&
    newVerb.past_masculine.trim() &&
    newVerb.past_feminine.trim() &&
    newVerb.past_neuter.trim() &&
    newVerb.past_plural.trim() &&
    newVerb.future_ya.trim() &&
    newVerb.future_ty.trim() &&
    newVerb.future_on_ona.trim() &&
    newVerb.future_my.trim() &&
    newVerb.future_vy.trim() &&
    newVerb.future_oni.trim() &&
    newVerb.imperative_singular.trim() &&
    newVerb.imperative_plural.trim()
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
  const exists = newVerb.translations.some(t => Object.keys(t)[0] === language)
  if (exists) {
    // Si existe, actualizar la traducción existente
    const index = newVerb.translations.findIndex(t => Object.keys(t)[0] === language)
    newVerb.translations[index] = translationObj
  } else {
    // Si no existe, agregar nueva traducción
    newVerb.translations.push(translationObj)
  }

  // Limpiar input
  newTranslationText.value = ''
}

// Eliminar traducción
const removeTranslation = (index) => {
  newVerb.translations.splice(index, 1)
}

// Cargar verbos al montar
onMounted(() => {
  fetchVerbs()
})

// Resetear formulario
const resetForm = () => {
  newVerb.infinitive = ''
  newVerb.conjugationType = 1
  newVerb.root = ''
  newVerb.translations = []
  newTranslationLanguage.value = 'es'
  newTranslationText.value = ''
  newVerb.present_ya = ''
  newVerb.present_ty = ''
  newVerb.present_on_ona = ''
  newVerb.present_my = ''
  newVerb.present_vy = ''
  newVerb.present_oni = ''
  newVerb.past_masculine = ''
  newVerb.past_feminine = ''
  newVerb.past_neuter = ''
  newVerb.past_plural = ''
  newVerb.future_ya = ''
  newVerb.future_ty = ''
  newVerb.future_on_ona = ''
  newVerb.future_my = ''
  newVerb.future_vy = ''
  newVerb.future_oni = ''
  newVerb.imperative_singular = ''
  newVerb.imperative_plural = ''
  error.value = ''
}

// Agregar verbo
const handleAddVerb = async () => {
  error.value = ''

  // Preparar datos para la API
  const verbData = {
    infinitive: newVerb.infinitive.trim(),
    conjugationType: newVerb.conjugationType,
    root: newVerb.root.trim(),
    translations: newVerb.translations,
    present_ya: newVerb.present_ya.trim(),
    present_ty: newVerb.present_ty.trim(),
    present_on_ona: newVerb.present_on_ona.trim(),
    present_my: newVerb.present_my.trim(),
    present_vy: newVerb.present_vy.trim(),
    present_oni: newVerb.present_oni.trim(),
    past_masculine: newVerb.past_masculine.trim(),
    past_feminine: newVerb.past_feminine.trim(),
    past_neuter: newVerb.past_neuter.trim(),
    past_plural: newVerb.past_plural.trim(),
    future_ya: newVerb.future_ya.trim(),
    future_ty: newVerb.future_ty.trim(),
    future_on_ona: newVerb.future_on_ona.trim(),
    future_my: newVerb.future_my.trim(),
    future_vy: newVerb.future_vy.trim(),
    future_oni: newVerb.future_oni.trim(),
    imperative_singular: newVerb.imperative_singular.trim(),
    imperative_plural: newVerb.imperative_plural.trim(),
  }

  const result = await createVerb(verbData)

  if (result.success) {
    resetForm()
  } else {
    error.value = result.error || 'Error al añadir el verbo'
  }
}

// Eliminar verbo
const handleDeleteVerb = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este verbo?')) return

  const result = await deleteVerb(id)

  if (!result.success) {
    alert(result.error || 'Error al eliminar el verbo')
  }
}
</script>

