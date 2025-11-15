<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Verbos</h1>
      <p class="text-gray-600">Gestiona tu lista de verbos para practicar</p>
    </div>

    <!-- Formulario para agregar verbo -->
    <div class="mb-8 p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">Añadir Nuevo Verbo</h2>

      <form @submit.prevent="handleAddVerb" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div class="gap-4 grid md:grid-cols-2">
          <div>
            <label for="infinitive" class="block mb-1 font-medium text-gray-700 text-sm">
              Infinitivo (ej: работать)
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
              Tipo de Conjugación
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
        </div>

        <button
          type="submit"
          :disabled="loading || !newVerb.infinitive.trim()"
          class="w-full btn-primary"
        >
          {{ loading ? 'Añadiendo...' : 'Añadir Verbo' }}
        </button>
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
const { getVerbRoot } = useConjugation()

const newVerb = reactive({
  infinitive: '',
  conjugationType: 1,
})

const error = ref('')

// Cargar verbos al montar
onMounted(() => {
  fetchVerbs()
})

// Agregar verbo
const handleAddVerb = async () => {
  error.value = ''

  const root = getVerbRoot(newVerb.infinitive, newVerb.conjugationType)
  const verbData = {
    infinitive: newVerb.infinitive,
    conjugationType: newVerb.conjugationType,
    root: root,
  }

  const result = await createVerb(verbData)

  if (result.success) {
    newVerb.infinitive = ''
    newVerb.conjugationType = 1
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

