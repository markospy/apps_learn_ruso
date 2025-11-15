<template>
  <NuxtLayout name="auth">
    <div class="p-8 card">
      <h2 class="mb-6 font-bold text-gray-800 text-2xl">Registro</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <label for="name" class="block mb-1 font-medium text-gray-700 text-sm">
            Nombre Completo
          </label>
          <input
            id="name"
            v-model="userData.name"
            type="text"
            required
            class="input-field"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label for="email" class="block mb-1 font-medium text-gray-700 text-sm">
            Email
          </label>
          <input
            id="email"
            v-model="userData.email"
            type="email"
            required
            class="input-field"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label for="username" class="block mb-1 font-medium text-gray-700 text-sm">
            Usuario
          </label>
          <input
            id="username"
            v-model="userData.username"
            type="text"
            required
            class="input-field"
            placeholder="Elige un nombre de usuario"
          />
        </div>

        <div>
          <label for="password" class="block mb-1 font-medium text-gray-700 text-sm">
            Contraseña
          </label>
          <input
            id="password"
            v-model="userData.password"
            type="password"
            required
            minlength="6"
            class="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label for="country" class="block mb-1 font-medium text-gray-700 text-sm">
            País (opcional)
          </label>
          <input
            id="country"
            v-model="userData.country"
            type="text"
            class="input-field"
            placeholder="Tu país"
          />
        </div>

        <div>
          <div v-if="loadingRoles">
            <div class="border-gray-900 border-b-2 rounded-full w-5 h-5 animate-spin"></div>
          </div>
          <div v-else>
            <label for="role" class="block mb-1 font-medium text-gray-700 text-sm">
              Rol del usuario
            </label>
            <select
              id="role"
              v-model="userData.role"
              class="input-field"
            >
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary"
        >
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-700">
            Inicia sesión aquí
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

const { register } = useAuth()
const router = useRouter()
const { roles, loading: loadingRoles, error: errorRoles, fetchRoles } = useRoles()
const userData = reactive({
  name: '',
  email: '',
  username: '',
  password: '',
  country: '',
  language: 'es',
})

onMounted(async () => {
  await fetchRoles()
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  const result = await register(userData)

  if (result.success) {
    router.push('/practice')
  } else {
    error.value = result.error || 'Error al registrarse'
  }

  loading.value = false
}
</script>

