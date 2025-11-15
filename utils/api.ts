import axios from 'axios'

export const createApiClient = () => {
  const config = useRuntimeConfig()
  const authToken = useCookie('auth_token')

  const api = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - agregar token JWT
  api.interceptors.request.use(
    (config) => {
      if (authToken.value) {
        config.headers.Authorization = `Bearer ${authToken.value}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - manejar errores 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expirado o inválido
        authToken.value = null
        if (process.client) {
          navigateTo('/login')
        }
      }
      return Promise.reject(error)
    }
  )

  return api
}

