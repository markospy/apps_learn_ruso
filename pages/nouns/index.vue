<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Sustantivos</h1>
      <p class="text-gray-600">Gestiona tu lista de sustantivos para practicar</p>
    </div>

    <!-- Nota: Los endpoints para agregar sustantivos fueron eliminados de la API -->

    <!-- Lista de sustantivos -->
    <div class="p-6 card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-gray-700 text-2xl">
          Mi Lista de Sustantivos ({{ pagination.total }})
        </h2>
        <button
          v-if="nouns.length > 0"
          @click="loadPage(pagination.page)"
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
        <p class="text-lg">No hay sustantivos disponibles</p>
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
              Género: {{ genderLabel(noun.gender) }} |
              Singular: {{ noun.declension?.singular?.nominative?.word || 'N/A' }} |
              Plural: {{ noun.declension?.plural?.nominative?.word || 'N/A' }}
            </p>
            <p v-if="noun.translations && noun.translations.length > 0" class="mt-1 text-gray-400 text-xs">
              {{ getTranslationsText(noun.translations) }}
            </p>
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

const { nouns, loading, fetchNouns, pagination } = useNouns()

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

// Cargar página específica
const loadPage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  fetchNouns(page, pagination.value.perPage)
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
</script>

