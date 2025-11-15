<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Fondos tenues -->
    <div class="z-0 fixed inset-0">
      <!-- Mapa de Rusia -->
      <div
        class="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-10"
        style="background-image: url('https://fvmstatic.s3.amazonaws.com/maps/m/RU-EPS-02-6001.png');"
      ></div>

      <!-- Bandera de Rusia -->
      <div
        class="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-10"
        style="background-image: url('https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1200px-Flag_of_Russia.svg.png');"
      ></div>

      <!-- Overlay para mejor legibilidad -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80"></div>
    </div>

    <!-- Contenido principal -->
    <div class="z-10 relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div class="mx-auto w-full max-w-4xl text-center">
        <!-- Logo/Título principal -->
        <div class="mb-8">
          <h1 class="mb-4 font-extrabold text-gray-900 text-5xl sm:text-6xl lg:text-7xl">
            🇷🇺 Aprende Ruso
          </h1>
          <div class="bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 mx-auto rounded-full w-24 h-1"></div>
        </div>

        <!-- Descripción principal -->
        <div class="space-y-6 mb-12">
          <p class="font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl leading-relaxed">
            Domina la conjugación de verbos y el género de sustantivos en ruso
          </p>
          <p class="mx-auto max-w-3xl text-gray-700 text-lg sm:text-xl lg:text-2xl leading-relaxed">
            Practica con ejercicios interactivos, aprende las reglas gramaticales y mejora tu pronunciación con nuestra plataforma de aprendizaje completa.
          </p>
        </div>

        <!-- Características -->
        <div class="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <!-- Característica 1 -->
          <div class="bg-white/90 shadow-lg hover:shadow-xl backdrop-blur-sm p-6 border border-gray-200 rounded-xl transition-shadow">
            <div class="mb-4 text-4xl">📝</div>
            <h3 class="mb-2 font-bold text-gray-800 text-xl">Conjugación de Verbos</h3>
            <p class="text-gray-600 text-sm">
              Practica presente, pasado, futuro e imperativo con ejercicios interactivos
            </p>
          </div>

          <!-- Característica 2 -->
          <div class="bg-white/90 shadow-lg hover:shadow-xl backdrop-blur-sm p-6 border border-gray-200 rounded-xl transition-shadow">
            <div class="mb-4 text-4xl">📚</div>
            <h3 class="mb-2 font-bold text-gray-800 text-xl">Género de Sustantivos</h3>
            <p class="text-gray-600 text-sm">
              Aprende a identificar correctamente el género (masculino, femenino, neutro)
            </p>
          </div>

          <!-- Característica 3 -->
          <div class="sm:col-span-2 lg:col-span-1 bg-white/90 shadow-lg hover:shadow-xl backdrop-blur-sm p-6 border border-gray-200 rounded-xl transition-shadow">
            <div class="mb-4 text-4xl">🔊</div>
            <h3 class="mb-2 font-bold text-gray-800 text-xl">Pronunciación</h3>
            <p class="text-gray-600 text-sm">
              Escucha y practica la pronunciación correcta de palabras y frases
            </p>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="bg-white/80 shadow-xl backdrop-blur-sm mx-auto p-8 border border-gray-200 rounded-2xl max-w-2xl">
          <h2 class="mb-4 font-bold text-gray-800 text-2xl sm:text-3xl">
            ¿Por qué aprender ruso?
          </h2>
          <ul class="space-y-3 text-gray-700 text-base sm:text-lg text-left">
            <li class="flex items-start">
              <span class="mr-3 text-blue-600 text-xl">✓</span>
              <span>El ruso es hablado por más de 260 millones de personas en el mundo</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3 text-blue-600 text-xl">✓</span>
              <span>Es uno de los idiomas oficiales de la ONU</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3 text-blue-600 text-xl">✓</span>
              <span>Abre puertas profesionales en negocios, diplomacia y tecnología</span>
            </li>
            <li class="flex items-start">
              <span class="mr-3 text-blue-600 text-xl">✓</span>
              <span>Accede a una rica cultura literaria, musical y artística</span>
            </li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div class="mt-12">
          <p class="mb-6 text-gray-700 text-lg sm:text-xl">
            ¿Listo para comenzar tu viaje de aprendizaje?
          </p>
          <div class="flex sm:flex-row flex-col justify-center items-center gap-4">
            <NuxtLink
              to="/register"
              class="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-8 py-4 rounded-lg font-bold text-white text-lg hover:scale-105 transition-all transform"
            >
              Crear Cuenta Gratis
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl px-8 py-4 border-2 border-blue-600 rounded-lg font-bold text-blue-600 text-lg transition-all"
            >
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'landing'
})
</script>

<style scoped>
/* Asegurar que los fondos se vean correctamente */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}
</style>
