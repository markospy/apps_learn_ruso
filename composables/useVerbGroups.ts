export const useVerbGroups = () => {
  const groups = useState('verbGroups', () => [])
  const currentGroup = useState('currentVerbGroup', () => null)
  const loading = ref(false)
  const error = ref(null)

  const api = createApiClient()

  // Obtener todos los grupos del usuario actual
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/verb-groups')
      groups.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar grupos'
      console.error('Fetch groups error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Obtener un grupo específico con sus verbos
  const fetchGroup = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/verb-groups/${id}`)
      currentGroup.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar grupo'
      console.error('Fetch group error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Crear un grupo
  const createGroup = async (groupData: { name_group: string }) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/verb-groups', groupData)
      groups.value.push(data)
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al crear grupo'
      console.error('Create group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Actualizar un grupo
  const updateGroup = async (id: number, groupData: { name_group: string }) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put(`/verb-groups/${id}`, groupData)
      const index = groups.value.findIndex((g: any) => g.id === id)
      if (index !== -1) {
        groups.value[index] = data
      }
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al actualizar grupo'
      console.error('Update group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar un grupo
  const deleteGroup = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/verb-groups/${id}`)
      groups.value = groups.value.filter((g: any) => g.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar grupo'
      console.error('Delete group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Agregar un verbo al grupo
  const addVerbToGroup = async (groupId: number, verbId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.post(`/verb-groups/${groupId}/verbs/${verbId}`)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al agregar verbo al grupo'
      console.error('Add verb to group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar un verbo del grupo
  const removeVerbFromGroup = async (groupId: number, verbId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/verb-groups/${groupId}/verbs/${verbId}`)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar verbo del grupo'
      console.error('Remove verb from group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addVerbToGroup,
    removeVerbFromGroup,
  }
}

