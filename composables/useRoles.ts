export const useRoles = () => {
    const roles = useState('roles', () => [])
    const currentRole = useState('currentRole', () => null)
    const loading = ref(false)
    const error = ref(null)

    const api = createApiClient()

    // Obtener todos los roles del sistema
    const fetchRoles = async () => {
      loading.value = true
      error.value = null
      try {
        const { data } = await api.get('/roles')
        roles.value = data
        return data
      } catch (err: any) {
        error.value = err.response?.data?.detail || 'Error al cargar roles'
        console.error('Fetch roles error:', err)
        return []
      } finally {
        loading.value = false
      }
    }

    return {
      roles,
      currentRole,
      loading,
      error,
      fetchRoles,
    }
  }