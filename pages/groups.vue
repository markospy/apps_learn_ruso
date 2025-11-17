<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Grupos de Estudio</h1>
      <p class="text-gray-600">Organiza tus verbos y sustantivos en grupos personalizados</p>
    </div>

    <!-- Selector de tipo de grupo -->
    <div class="mb-6">
      <div class="flex gap-2">
        <button
          @click="groupType = 'verbs'"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors',
            groupType === 'verbs'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          ]"
        >
          Grupos de Verbos
        </button>
        <button
          @click="groupType = 'nouns'"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors',
            groupType === 'nouns'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          ]"
        >
          Grupos de Sustantivos
        </button>
      </div>
    </div>

    <!-- Formulario para crear/editar grupo -->
    <div class="mb-8 p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">
        {{ editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo' }}
      </h2>

      <form @submit.prevent="handleSaveGroup" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <label for="groupName" class="block mb-1 font-medium text-gray-700 text-sm">
            Nombre del Grupo
          </label>
          <input
            id="groupName"
            v-model="groupName"
            type="text"
            required
            class="input-field"
            placeholder="Ej: Verbos de Movimiento"
          />
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="loading || !groupName.trim()"
            class="flex-1 btn-primary"
          >
            {{ loading ? 'Guardando...' : (editingGroup ? 'Actualizar' : 'Crear') }} Grupo
          </button>
          <button
            v-if="editingGroup"
            type="button"
            @click="cancelEdit"
            class="px-6 btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de grupos -->
    <div class="p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">
        Mis Grupos {{ groupType === 'verbs' ? 'de Verbos' : 'de Sustantivos' }} ({{ currentGroups.length }})
      </h2>

      <!-- Loading state -->
      <div v-if="loading && currentGroups.length === 0" class="py-8 text-gray-500 text-center">
        <p>Cargando grupos...</p>
      </div>

      <!-- Sin grupos -->
      <div v-else-if="currentGroups.length === 0" class="py-8 text-gray-500 text-center">
        <p class="text-lg">No tienes grupos creados</p>
        <p class="mt-2 text-sm">Crea tu primer grupo usando el formulario de arriba</p>
      </div>

      <!-- Lista de grupos -->
      <div v-else class="space-y-3">
        <div
          v-for="group in currentGroups"
          :key="group.id"
          class="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 text-lg">{{ group.name_group }}</h3>
              <p class="mt-1 text-gray-500 text-sm">
                Creado: {{ new Date(group.created_at).toLocaleDateString() }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editGroup(group)"
                class="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-semibold text-white transition-colors"
              >
                Editar
              </button>
              <button
                @click="openAddItemsModal(group)"
                class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-semibold text-white transition-colors"
              >
                Agregar {{ groupType === 'verbs' ? 'Verbos' : 'Sustantivos' }}
              </button>
              <button
                @click="handleDeleteGroup(group.id)"
                class="hover:bg-red-50 px-4 py-2 rounded font-semibold text-red-500 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar verbos/sustantivos -->
    <div
      v-if="showAddItemsModal"
      class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      @click.self="closeAddItemsModal"
    >
      <div class="bg-white mx-4 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-800 text-xl">
            Agregar {{ groupType === 'verbs' ? 'Verbos' : 'Sustantivos' }} a "{{ selectedGroup?.name_group }}"
          </h3>
          <button
            @click="closeAddItemsModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <!-- Buscador -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full input-field"
            :placeholder="`Buscar ${groupType === 'verbs' ? 'verbos' : 'sustantivos'}...`"
          />
        </div>

        <!-- Lista de items -->
        <div v-if="loadingItems" class="py-8 text-gray-500 text-center">
          <p>Cargando...</p>
        </div>
        <div v-else-if="filteredItems.length === 0" class="py-8 text-gray-500 text-center">
          <p>No hay {{ groupType === 'verbs' ? 'verbos' : 'sustantivos' }} disponibles</p>
        </div>
        <div v-else class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="flex justify-between items-center p-3 rounded-lg transition-colors"
            :class="isItemInGroup(item.id) ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 hover:bg-gray-100'"
          >
            <div class="flex flex-1 items-center gap-3">
              <div v-if="isItemInGroup(item.id)" class="flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">
                  <template v-if="groupType === 'verbs'">
                    {{ item.imperfective?.infinitive?.word?.word || 'N/A' }}
                  </template>
                  <template v-else>
                    {{ item.noun }}
                  </template>
                </p>
                <p v-if="getSpanishTranslation(item)" class="mt-1 text-gray-500 text-sm">
                  {{ getSpanishTranslation(item) }}
                </p>
              </div>
            </div>
            <button
              v-if="!isItemInGroup(item.id)"
              @click="addItemToGroup(item.id)"
              :disabled="addingItemId === item.id"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-4 py-2 rounded font-semibold text-white text-sm transition-colors disabled:cursor-not-allowed"
            >
              {{ addingItemId === item.id ? 'Agregando...' : 'Agregar' }}
            </button>
            <span v-else class="px-4 py-2 font-semibold text-green-600 text-sm">
              En el grupo
            </span>
          </div>
        </div>

        <!-- Paginación del modal -->
        <div v-if="itemsPagination.totalPages > 1" class="flex justify-center items-center gap-2 mt-4">
          <button
            @click="loadItemsPage(itemsPagination.page - 1)"
            :disabled="itemsPagination.page === 1 || loadingItems"
            class="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span class="px-4 py-2 text-gray-700">
            Página {{ itemsPagination.page }} de {{ itemsPagination.totalPages }}
          </span>
          <button
            @click="loadItemsPage(itemsPagination.page + 1)"
            :disabled="itemsPagination.page >= itemsPagination.totalPages || loadingItems"
            class="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Siguiente
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

const { groups: verbGroups, loading: verbGroupsLoading, fetchGroups: fetchVerbGroups, createGroup: createVerbGroup, updateGroup: updateVerbGroup, deleteGroup: deleteVerbGroup, addVerbToGroup, fetchGroup: fetchVerbGroup } = useVerbGroups()
const { groups: nounGroups, loading: nounGroupsLoading, fetchGroups: fetchNounGroups, createGroup: createNounGroup, updateGroup: updateNounGroup, deleteGroup: deleteNounGroup, addNounToGroup, fetchGroup: fetchNounGroup } = useNounGroups()
const { verbs, fetchVerbs, pagination: verbsPagination } = useVerbs()
const { nouns, fetchNouns, pagination: nounsPagination } = useNouns()

const groupType = ref('verbs')
const groupName = ref('')
const editingGroup = ref(null)
const error = ref('')
const showAddItemsModal = ref(false)
const selectedGroup = ref(null)
const selectedGroupDetails = ref(null)
const searchQuery = ref('')
const loadingItems = ref(false)
const addingItemId = ref(null)

// Computed
const currentGroups = computed(() => {
  return groupType.value === 'verbs' ? verbGroups.value : nounGroups.value
})

const loading = computed(() => {
  return groupType.value === 'verbs' ? verbGroupsLoading.value : nounGroupsLoading.value
})

const itemsPagination = computed(() => {
  return groupType.value === 'verbs' ? verbsPagination.value : nounsPagination.value
})

const filteredItems = computed(() => {
  const items = groupType.value === 'verbs' ? verbs.value : nouns.value
  if (!searchQuery.value.trim()) return items

  const query = searchQuery.value.toLowerCase()
  return items.filter(item => {
    if (groupType.value === 'verbs') {
      const infinitive = item.imperfective?.infinitive?.word?.word || ''
      const translation = getSpanishTranslation(item) || ''
      return infinitive.toLowerCase().includes(query) || translation.toLowerCase().includes(query)
    } else {
      const noun = item.noun || ''
      const translation = getSpanishTranslation(item) || ''
      return noun.toLowerCase().includes(query) || translation.toLowerCase().includes(query)
    }
  })
})

// Obtener traducción al español
const getSpanishTranslation = (item) => {
  if (!item.translations || item.translations.length === 0) return ''
  const translation = item.translations[0]
  if (translation.es && Array.isArray(translation.es) && translation.es.length > 0) {
    return translation.es.join(', ')
  }
  return ''
}

// Verificar si un item ya está en el grupo
const isItemInGroup = (itemId) => {
  if (!selectedGroupDetails.value) return false

  if (groupType.value === 'verbs') {
    return selectedGroupDetails.value.verbs?.some((v) => v.id === itemId) || false
  } else {
    return selectedGroupDetails.value.nouns?.some((n) => n.id === itemId) || false
  }
}

// Métodos
const loadGroups = async () => {
  if (groupType.value === 'verbs') {
    await fetchVerbGroups()
  } else {
    await fetchNounGroups()
  }
}

const handleSaveGroup = async () => {
  error.value = ''

  if (editingGroup.value) {
    // Actualizar grupo
    const result = groupType.value === 'verbs'
      ? await updateVerbGroup(editingGroup.value.id, { name_group: groupName.value })
      : await updateNounGroup(editingGroup.value.id, { name_group: groupName.value })

    if (result.success) {
      groupName.value = ''
      editingGroup.value = null
      await loadGroups()
    } else {
      error.value = result.error || 'Error al actualizar el grupo'
    }
  } else {
    // Crear grupo
    const result = groupType.value === 'verbs'
      ? await createVerbGroup({ name_group: groupName.value })
      : await createNounGroup({ name_group: groupName.value })

    if (result.success) {
      groupName.value = ''
      await loadGroups()
    } else {
      error.value = result.error || 'Error al crear el grupo'
    }
  }
}

const editGroup = (group) => {
  editingGroup.value = group
  groupName.value = group.name_group
}

const cancelEdit = () => {
  editingGroup.value = null
  groupName.value = ''
  error.value = ''
}

const handleDeleteGroup = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este grupo?')) return

  const result = groupType.value === 'verbs'
    ? await deleteVerbGroup(id)
    : await deleteNounGroup(id)

  if (!result.success) {
    alert(result.error || 'Error al eliminar el grupo')
  } else {
    await loadGroups()
  }
}

const openAddItemsModal = async (group) => {
  selectedGroup.value = group
  showAddItemsModal.value = true

  // Cargar detalles del grupo para saber qué items ya están incluidos
  loadingItems.value = true
  try {
    if (groupType.value === 'verbs') {
      selectedGroupDetails.value = await fetchVerbGroup(group.id)
    } else {
      selectedGroupDetails.value = await fetchNounGroup(group.id)
    }
  } catch (err) {
    console.error('Error loading group details:', err)
    selectedGroupDetails.value = null
  } finally {
    loadingItems.value = false
  }

  await loadItems(1)
}

const closeAddItemsModal = () => {
  showAddItemsModal.value = false
  selectedGroup.value = null
  selectedGroupDetails.value = null
  searchQuery.value = ''
}

const loadItems = async (page = 1) => {
  loadingItems.value = true
  try {
    if (groupType.value === 'verbs') {
      await fetchVerbs(page, 20)
    } else {
      await fetchNouns(page, 20)
    }
  } finally {
    loadingItems.value = false
  }
}

const loadItemsPage = (page) => {
  if (page < 1 || page > itemsPagination.value.totalPages) return
  loadItems(page)
}

const addItemToGroup = async (itemId) => {
  if (!selectedGroup.value) return

  addingItemId.value = itemId
  try {
    const result = groupType.value === 'verbs'
      ? await addVerbToGroup(selectedGroup.value.id, itemId)
      : await addNounToGroup(selectedGroup.value.id, itemId)

    if (result.success) {
      // Recargar detalles del grupo para actualizar la lista
      if (groupType.value === 'verbs') {
        selectedGroupDetails.value = await fetchVerbGroup(selectedGroup.value.id)
      } else {
        selectedGroupDetails.value = await fetchNounGroup(selectedGroup.value.id)
      }
      // Recargar items para actualizar la lista
      await loadItems(itemsPagination.value.page)
    } else {
      alert(result.error || `Error al agregar ${groupType.value === 'verbs' ? 'verbo' : 'sustantivo'}`)
    }
  } finally {
    addingItemId.value = null
  }
}

// Watchers
watch(groupType, () => {
  editingGroup.value = null
  groupName.value = ''
  error.value = ''
  loadGroups()
})

// Cargar grupos al montar
onMounted(() => {
  loadGroups()
})
</script>
