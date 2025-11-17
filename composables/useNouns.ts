export const useNouns = () => {
  const nouns = useState('nouns', () => [])
  const currentNoun = useState('currentNoun', () => null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = useState('nounsPagination', () => ({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  }))

  const api = createApiClient()

  // Obtener todos los sustantivos
  const fetchNouns = async (page: number = 1, perPage: number = 20) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/nouns', {
        params: { page, per_page: perPage }
      })
      // La API ahora devuelve un objeto con items, total, page, per_page, total_pages
      nouns.value = data.items || []
      pagination.value = {
        page: data.page || page,
        perPage: data.per_page || perPage,
        total: data.total || 0,
        totalPages: data.total_pages || 0,
      }
      return data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar sustantivos'
      console.error('Fetch nouns error:', err)
      return { items: [], total: 0, page: 1, per_page: perPage, total_pages: 0 }
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

  // Nota: Los endpoints para crear, actualizar y eliminar sustantivos fueron eliminados de la API

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
    pagination,
    fetchNouns,
    fetchNoun,
    selectRandomNoun,
  }
}

