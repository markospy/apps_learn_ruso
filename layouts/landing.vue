<template>
  <div class="min-h-screen">
    <!-- Barra superior minimalista -->
    <nav class="top-0 right-0 left-0 z-50 absolute bg-transparent">
      <div class="flex justify-end items-center px-4 sm:px-6 lg:px-8 h-16">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/login"
            class="px-4 py-2 font-medium text-gray-700 hover:text-gray-900 text-sm transition-colors"
          >
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
          >
            Registrarse
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenido -->
    <slot />
  </div>
</template>

