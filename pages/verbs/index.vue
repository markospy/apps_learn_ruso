<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Administrar Verbos</h1>
      <p class="text-gray-600">Gestiona tu lista de verbos para practicar</p>
    </div>

    <!-- Nota: Los endpoints para agregar verbos fueron eliminados de la API -->

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
        <p class="text-lg">No hay verbos disponibles</p>
      </div>

      <!-- Lista de verbos -->
      <div v-else class="space-y-3">
        <div
          v-for="verb in verbs"
          :key="verb.id"
          class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
        >
          <div>
            <p class="font-medium text-gray-800 text-lg">
              {{ verb.imperfective?.infinitive?.word?.word || 'N/A' }}
            </p>
            <p class="text-gray-500 text-sm">
              Conjugación: {{ verb.conjugationType }} | Raíz: {{ verb.root || 'N/A' }}
            </p>
            <p v-if="verb.translations && verb.translations.length > 0" class="mt-1 text-gray-400 text-xs">
              {{ getTranslationsText(verb.translations) }}
            </p>
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

const { verbs, loading, fetchVerbs } = useVerbs()

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

// Cargar verbos al montar
onMounted(() => {
  fetchVerbs()
})
</script>

