<template>
  <NuxtLayout name="auth">
    <div class="p-8 card">
      <h2 class="mb-6 font-bold text-gray-800 text-2xl">Iniciar Sesión</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <label for="username" class="block mb-1 font-medium text-gray-700 text-sm">
            Usuario
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            class="input-field"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div>
          <label for="password" class="block mb-1 font-medium text-gray-700 text-sm">
            Contraseña
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="input-field"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-700">
            Regístrate aquí
          </NuxtLink>
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const { login } = useAuth()
const router = useRouter()

const credentials = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await login(credentials)

  if (result.success) {
    router.push('/verbs/practice')
  } else {
    error.value = result.error || 'Error al iniciar sesión'
  }

  loading.value = false
}
</script>

