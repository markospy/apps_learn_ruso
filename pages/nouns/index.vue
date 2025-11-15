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
              Sustantivo (ej: стол - mesa)
            </label>
            <input
              id="noun"
              v-model="newNoun.sustantivo"
              type="text"
              required
              class="input-field"
              placeholder="Escribe el sustantivo en ruso"
            />
          </div>

          <div>
            <label for="gender" class="block mb-1 font-medium text-gray-700 text-sm">
              Género
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
              Singular
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
              Plural
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

        <button
          type="submit"
          :disabled="loading || !newNoun.sustantivo.trim()"
          class="w-full btn-primary"
        >
          {{ loading ? 'Añadiendo...' : 'Añadir Sustantivo' }}
        </button>
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
            <p class="font-medium text-gray-800 text-lg">{{ noun.sustantivo }}</p>
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

// TODO: Crear composable useNouns cuando la API esté lista
const nouns = ref([])
const loading = ref(false)
const error = ref('')

const newNoun = reactive({
  sustantivo: '',
  gender: 'masculine',
  singular: '',
  plural: '',
})

// Temporalmente usamos datos locales hasta que la API esté lista
onMounted(() => {
  // fetchNouns()
})

const genderLabel = (gender) => {
  const labels = {
    masculine: 'Masculino (он)',
    feminine: 'Femenino (она)',
    neuter: 'Neutro (оно)'
  }
  return labels[gender] || gender
}

const fetchNouns = async () => {
  // TODO: Implementar cuando el endpoint de la API esté listo
  console.log('fetchNouns - API endpoint pendiente')
}

const handleAddNoun = async () => {
  error.value = ''
  loading.value = true

  // TODO: Implementar cuando el endpoint de la API esté listo
  console.log('Nuevo sustantivo:', newNoun)

  // Simular guardado local
  nouns.value.push({
    id: Date.now(),
    ...newNoun
  })

  // Limpiar formulario
  newNoun.sustantivo = ''
  newNoun.gender = 'masculine'
  newNoun.singular = ''
  newNoun.plural = ''

  loading.value = false
}

const handleDeleteNoun = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este sustantivo?')) return

  // TODO: Implementar cuando el endpoint de la API esté listo
  nouns.value = nouns.value.filter(n => n.id !== id)
}
</script>

