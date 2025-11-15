export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchCurrentUser } = useAuth()
  const authToken = useCookie('auth_token')

  // Si hay token pero no hay usuario cargado, intentar obtenerlo
  if (authToken.value && !isAuthenticated.value) {
    await fetchCurrentUser()
  }

  // Si no está autenticado y la ruta requiere autenticación, redirigir a login
  if (!isAuthenticated.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // Si está autenticado y trata de acceder a login o register, redirigir a practice
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/practice')
  }
})

