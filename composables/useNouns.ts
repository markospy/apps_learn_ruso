export const useNouns = () => {
  const nouns = useState('nouns', () => [])
  const currentNoun = useState('currentNoun', () => null)
  const loading = ref(false)
  const error = ref(null)

  const api = createApiClient()

  // Obtener todos los sustantivos
  const fetchNouns = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/nouns')
      nouns.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar sustantivos'
      console.error('Fetch nouns error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Obtener un sustantivo específico
  const fetchNoun = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/nouns/${id}`)
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar sustantivo'
      console.error('Fetch noun error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Crear un sustantivo
  const createNoun = async (nounData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/nouns', nounData)
      nouns.value.push(data)
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al crear sustantivo'
      console.error('Create noun error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Actualizar un sustantivo
  const updateNoun = async (id: number, nounData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put(`/nouns/${id}`, nounData)
      const index = nouns.value.findIndex((n: any) => n.id === id)
      if (index !== -1) {
        nouns.value[index] = data
      }
      return { success: true, data }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al actualizar sustantivo'
      console.error('Update noun error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar un sustantivo
  const deleteNoun = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/nouns/${id}`)
      nouns.value = nouns.value.filter((n: any) => n.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar sustantivo'
      console.error('Delete noun error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Seleccionar un sustantivo aleatorio para práctica
  const selectRandomNoun = () => {
    if (nouns.value.length === 0) {
      currentNoun.value = null
      return null
    }
    const randomIndex = Math.floor(Math.random() * nouns.value.length)
    currentNoun.value = nouns.value[randomIndex]
    return currentNoun.value
  }

  return {
    nouns,
    currentNoun,
    loading,
    error,
    fetchNouns,
    fetchNoun,
    createNoun,
    updateNoun,
    deleteNoun,
    selectRandomNoun,
  }
}

