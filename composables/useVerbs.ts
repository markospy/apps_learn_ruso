export const useVerbs = () => {
  const verbs = useState('verbs', () => [])
  const currentVerb = useState('currentVerb', () => null)
  const loading = ref(false)
  const error = ref(null)

  const api = createApiClient()

  // Obtener todos los verbos
  const fetchVerbs = async (page: number = 1, perPage: number = 100) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/verbs', {
        params: { page, per_page: perPage }
      })
      // La API ahora devuelve un objeto con items, total, page, per_page, total_pages
      verbs.value = data.items || []
      return data.items || []
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

  // Nota: Los endpoints para crear, actualizar y eliminar verbos fueron eliminados de la API

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
    selectRandomVerb,
  }
}

