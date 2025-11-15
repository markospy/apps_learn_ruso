export const useVerbs = () => {
  const verbs = useState('verbs', () => [])
  const currentVerb = useState('currentVerb', () => null)
  const loading = ref(false)
  const error = ref(null)

  const api = createApiClient()

  // Obtener todos los verbos
  const fetchVerbs = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/verbs')
      verbs.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar verbos'
      console.error('Fetch verbs error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Obtener un verbo específico
  const fetchVerb = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/verbs/${id}`)
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar verbo'
      console.error('Fetch verb error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Crear un verbo
  const createVerb = async (verbData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/verbs', verbData)
      verbs.value.push(data)
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al crear verbo'
      console.error('Create verb error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Actualizar un verbo
  const updateVerb = async (id: number, verbData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put(`/verbs/${id}`, verbData)
      const index = verbs.value.findIndex((v: any) => v.id === id)
      if (index !== -1) {
        verbs.value[index] = data
      }
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al actualizar verbo'
      console.error('Update verb error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar un verbo
  const deleteVerb = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/verbs/${id}`)
      verbs.value = verbs.value.filter((v: any) => v.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar verbo'
      console.error('Delete verb error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Seleccionar un verbo aleatorio para práctica
  const selectRandomVerb = () => {
    if (verbs.value.length === 0) {
      currentVerb.value = null
      return null
    }
    const randomIndex = Math.floor(Math.random() * verbs.value.length)
    currentVerb.value = verbs.value[randomIndex]
    return currentVerb.value
  }

  return {
    verbs,
    currentVerb,
    loading,
    error,
    fetchVerbs,
    fetchVerb,
    createVerb,
    updateVerb,
    deleteVerb,
    selectRandomVerb,
  }
}

