export const useAuth = () => {
  const authToken = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  const user = useState('user', () => null)
  const isAuthenticated = computed(() => !!authToken.value && !!user.value)

  const login = async (credentials: { username: string; password: string }) => {
    const api = createApiClient()
    try {
      // Enviar como form-urlencoded según los requerimientos de la API
      const formData = new URLSearchParams()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)

      const { data } = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      authToken.value = data.access_token
      user.value = data.user
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al iniciar sesión'
      }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    username: string
    password: string
    country?: string
    language?: string
  }) => {
    const api = createApiClient()
    try {
      const { data } = await api.post('/auth/register', userData)
      authToken.value = data.access_token
      user.value = data.user
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Register error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al registrarse'
      }
    }
  }

  const logout = () => {
    authToken.value = null
    user.value = null
    navigateTo('')
  }

  const fetchCurrentUser = async () => {
    if (!authToken.value) return null

    const api = createApiClient()
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      return data
    } catch (error) {
      console.error('Fetch user error:', error)
      authToken.value = null
      user.value = null
      return null
    }
  }

  const refreshToken = async () => {
    const api = createApiClient()
    try {
      const { data } = await api.post('/auth/refresh')
      authToken.value = data.access_token
      return true
    } catch (error) {
      console.error('Refresh token error:', error)
      logout()
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshToken,
  }
}

