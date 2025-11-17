export const useNounGroups = () => {
  const groups = useState('nounGroups', () => [])
  const currentGroup = useState('currentNounGroup', () => null)
  const loading = ref(false)
  const error = ref(null)

  const api = createApiClient()

  // Obtener todos los grupos del usuario actual
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/noun-groups')
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

  // Obtener un grupo específico con sus sustantivos
  const fetchGroup = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/noun-groups/${id}`)
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
      const { data } = await api.post('/noun-groups', groupData)
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
      const { data } = await api.put(`/noun-groups/${id}`, groupData)
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
      await api.delete(`/noun-groups/${id}`)
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

  // Agregar un sustantivo al grupo
  const addNounToGroup = async (groupId: number, nounId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.post(`/noun-groups/${groupId}/nouns/${nounId}`)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al agregar sustantivo al grupo'
      console.error('Add noun to group error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar un sustantivo del grupo
  const removeNounFromGroup = async (groupId: number, nounId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/noun-groups/${groupId}/nouns/${nounId}`)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar sustantivo del grupo'
      console.error('Remove noun from group error:', err)
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
    addNounToGroup,
    removeNounFromGroup,
  }
}

