<template>
  <div class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-md">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex justify-between items-center h-16">
          <!-- Logo / Título -->
          <div class="flex items-center">
            <NuxtLink to="/practice" class="font-bold text-blue-600 hover:text-blue-700 text-2xl">
              🇷🇺 Ruso App
            </NuxtLink>
          </div>

          <!-- Navegación -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink
              to="/practice"
              class="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Practicar
            </NuxtLink>
            <NuxtLink
              to="/verbs"
              class="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Verbos
            </NuxtLink>
            <NuxtLink
              to="/groups"
              class="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Grupos
            </NuxtLink>
            <NuxtLink
              to="/pronunciation"
              class="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Pronunciación
            </NuxtLink>
          </div>

          <!-- Usuario -->
          <div v-if="user" class="flex items-center space-x-4">
            <span class="text-gray-700 text-sm">{{ user.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium text-white text-sm transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <!-- Navegación móvil -->
      <div class="md:hidden space-y-1 px-2 py-2 border-gray-200 border-t">
        <NuxtLink
          to="/practice"
          class="block hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-base"
          active-class="text-blue-600 bg-blue-50"
        >
          Practicar
        </NuxtLink>
        <NuxtLink
          to="/verbs"
          class="block hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-base"
          active-class="text-blue-600 bg-blue-50"
        >
          Verbos
        </NuxtLink>
        <NuxtLink
          to="/groups"
          class="block hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-base"
          active-class="text-blue-600 bg-blue-50"
        >
          Grupos
        </NuxtLink>
        <NuxtLink
          to="/pronunciation"
          class="block hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-base"
          active-class="text-blue-600 bg-blue-50"
        >
          Pronunciación
        </NuxtLink>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

