<script setup>
// Redirigir al login o practice según autenticación
const { isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  navigateTo('/practice')
} else {
  navigateTo('/login')
}
</script>

