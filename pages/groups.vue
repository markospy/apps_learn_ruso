<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Grupos de Verbos</h1>
      <p class="text-gray-600">Organiza tus verbos en grupos personalizados</p>
    </div>

    <!-- Formulario para crear grupo -->
    <div class="mb-8 p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">Crear Nuevo Grupo</h2>

      <form @submit.prevent="handleCreateGroup" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <label for="groupName" class="block mb-1 font-medium text-gray-700 text-sm">
            Nombre del Grupo
          </label>
          <input
            id="groupName"
            v-model="newGroupName"
            type="text"
            required
            class="input-field"
            placeholder="Ej: Verbos de Movimiento"
          />
        </div>

        <button
          type="submit"
          :disabled="loading || !newGroupName.trim()"
          class="w-full btn-primary"
        >
          {{ loading ? 'Creando...' : 'Crear Grupo' }}
        </button>
      </form>
    </div>

    <!-- Lista de grupos -->
    <div class="p-6 card">
      <h2 class="mb-4 font-semibold text-gray-700 text-2xl">
        Mis Grupos ({{ groups.length }})
      </h2>

      <!-- Loading state -->
      <div v-if="loading && groups.length === 0" class="py-8 text-gray-500 text-center">
        <p>Cargando grupos...</p>
      </div>

      <!-- Sin grupos -->
      <div v-else-if="groups.length === 0" class="py-8 text-gray-500 text-center">
        <p class="text-lg">No tienes grupos creados</p>
        <p class="mt-2 text-sm">Crea tu primer grupo usando el formulario de arriba</p>
      </div>

      <!-- Lista de grupos -->
      <div v-else class="space-y-3">
        <div
          v-for="group in groups"
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
              <NuxtLink
                :to="`/groups/${group.id}`"
                class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold text-white transition-colors"
              >
                Ver
              </NuxtLink>
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
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { groups, loading, fetchGroups, createGroup, deleteGroup } = useVerbGroups()

const newGroupName = ref('')
const error = ref('')

// Cargar grupos al montar
onMounted(() => {
  fetchGroups()
})

// Crear grupo
const handleCreateGroup = async () => {
  error.value = ''

  const result = await createGroup({ name_group: newGroupName.value })

  if (result.success) {
    newGroupName.value = ''
  } else {
    error.value = result.error || 'Error al crear el grupo'
  }
}

// Eliminar grupo
const handleDeleteGroup = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este grupo?')) return

  const result = await deleteGroup(id)

  if (!result.success) {
    alert(result.error || 'Error al eliminar el grupo')
  }
}
</script>

