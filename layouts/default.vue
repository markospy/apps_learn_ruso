<template>
  <div class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-md">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex justify-between items-center h-16">
          <!-- Logo / Título -->
          <div class="flex items-center">
            <NuxtLink to="" class="font-bold text-blue-600 hover:text-blue-700 text-2xl">
              🇷🇺 Ruso App
            </NuxtLink>
          </div>

          <!-- Navegación Desktop -->
          <div class="hidden md:flex items-center space-x-1">

            <!-- Menú Vocabulario con submenús -->
            <div class="relative" @mouseenter="showVocabularioMenu = true" @mouseleave="showVocabularioMenu = false">
              <button
                class="flex items-center gap-1 hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              >
                Vocabulario
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Vocabulario -->
              <div
                v-show="showVocabularioMenu"
                class="left-0 z-50 absolute bg-white shadow-lg border border-gray-200 rounded-md w-48"
              >
                <!-- Verbos submenu -->
                <div class="relative" @mouseenter="showVerbosSubmenu = true" @mouseleave="showVerbosSubmenu = false">
                  <button
                    class="flex justify-between items-center hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
                  >
                    📝 Verbos
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <!-- Submenu Verbos -->
                  <div
                    v-show="showVerbosSubmenu"
                    class="top-0 left-full absolute bg-white shadow-lg border border-gray-200 rounded-md w-40"
                  >
                    <NuxtLink
                      to="/verbs"
                      class="block hover:bg-blue-50 px-4 py-2 rounded-t-md text-gray-700 hover:text-blue-600 text-sm"
                    >
                      ➕ Agregar
                    </NuxtLink>
                    <NuxtLink
                      to="/verbs/practice"
                      class="block hover:bg-blue-50 px-4 py-2 rounded-b-md text-gray-700 hover:text-blue-600 text-sm"
                    >
                      🎯 Práctica
                    </NuxtLink>
                  </div>
                </div>

                <!-- Sustantivos submenu -->
                <div class="relative" @mouseenter="showNounsSubmenu = true" @mouseleave="showNounsSubmenu = false">
                  <button
                    class="flex justify-between items-center hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
                  >
                    📚 Sustantivos
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <!-- Submenu Sustantivos -->
                  <div
                    v-show="showNounsSubmenu"
                    class="top-0 left-full absolute bg-white shadow-lg border border-gray-200 rounded-md w-40"
                  >
                    <NuxtLink
                      to="/nouns"
                      class="block hover:bg-blue-50 px-4 py-2 rounded-t-md text-gray-700 hover:text-blue-600 text-sm"
                    >
                      ➕ Agregar
                    </NuxtLink>
                    <NuxtLink
                      to="/nouns/practice"
                      class="block hover:bg-blue-50 px-4 py-2 rounded-b-md text-gray-700 hover:text-blue-600 text-sm"
                    >
                      🎯 Práctica
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <NuxtLink
              to="/groups"
              class="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Grupos
            </NuxtLink>

            <!-- Menú Gramática con submenús -->
            <div class="relative" @mouseenter="showGramaticaMenu = true" @mouseleave="showGramaticaMenu = false">
              <button
                class="flex items-center gap-1 hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-sm transition-colors"
              >
                Gramática
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Gramática -->
              <div
                v-show="showGramaticaMenu"
                class="left-0 z-50 absolute bg-white shadow-lg border border-gray-200 rounded-md w-56"
              >
                <button
                  @click="openModal('conjugations')"
                  class="flex items-center gap-2 hover:bg-blue-50 px-4 py-2 w-full text-gray-700 hover:text-blue-600 text-sm text-left"
                >
                  📋 Conjugaciones
                </button>
                <button
                  @click="openModal('vowels')"
                  class="flex items-center gap-2 hover:bg-green-50 px-4 py-2 w-full text-gray-700 hover:text-green-600 text-sm text-left"
                >
                  🔊 Vocales
                </button>
                <button
                  @click="openModal('consonants')"
                  class="flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 w-full text-gray-700 hover:text-indigo-600 text-sm text-left"
                >
                  🎵 Consonantes
                </button>
                <button
                  @click="openModal('gender')"
                  class="flex items-center gap-2 hover:bg-pink-50 px-4 py-2 w-full text-gray-700 hover:text-pink-600 text-sm text-left"
                >
                  👥 Género
                </button>
                <button
                  @click="openModal('pronouns')"
                  class="flex items-center gap-2 hover:bg-teal-50 px-4 py-2 w-full text-gray-700 hover:text-teal-600 text-sm text-left"
                >
                  💬 Pronombres
                </button>
                <button
                  @click="openModal('accusative')"
                  class="flex items-center gap-2 hover:bg-purple-50 px-4 py-2 rounded-b-md w-full text-gray-700 hover:text-purple-600 text-sm text-left"
                >
                  📖 Acusativo
                </button>
              </div>
            </div>

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

        <!-- Vocabulario Mobile -->
        <div>
          <button
            @click="showVocabularioMobile = !showVocabularioMobile"
            class="flex justify-between items-center hover:bg-gray-100 px-3 py-2 rounded-md w-full font-medium text-gray-700 hover:text-blue-600 text-base text-left"
          >
            Vocabulario
            <svg
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': showVocabularioMobile }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Submenu Vocabulario Mobile -->
          <div v-show="showVocabularioMobile" class="space-y-1 mt-1 ml-4">
            <!-- Verbos -->
            <div>
              <button
                @click="showVerbosMobile = !showVerbosMobile"
                class="flex justify-between items-center hover:bg-gray-100 px-3 py-2 rounded-md w-full text-gray-600 text-sm text-left"
              >
                📝 Verbos
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': showVerbosMobile }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="showVerbosMobile" class="space-y-1 ml-4">
                <NuxtLink
                  to="/verbs"
                  class="block hover:bg-blue-50 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 text-sm"
                >
                  ➕ Agregar
                </NuxtLink>
                <NuxtLink
                  to="/verbs/practice"
                  class="block hover:bg-blue-50 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 text-sm"
                >
                  🎯 Práctica
                </NuxtLink>
              </div>
            </div>

            <!-- Sustantivos -->
            <div>
              <button
                @click="showNounsMobile = !showNounsMobile"
                class="flex justify-between items-center hover:bg-gray-100 px-3 py-2 rounded-md w-full text-gray-600 text-sm text-left"
              >
                📚 Sustantivos
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': showNounsMobile }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="showNounsMobile" class="space-y-1 ml-4">
                <NuxtLink
                  to="/nouns"
                  class="block hover:bg-blue-50 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 text-sm"
                >
                  ➕ Agregar
                </NuxtLink>
                <NuxtLink
                  to="/nouns/practice"
                  class="block hover:bg-blue-50 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 text-sm"
                >
                  🎯 Práctica
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/groups"
          class="block hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 text-base"
          active-class="text-blue-600 bg-blue-50"
        >
          Grupos
        </NuxtLink>

        <!-- Gramática Mobile -->
        <div>
          <button
            @click="showGramaticaMobile = !showGramaticaMobile"
            class="flex justify-between items-center hover:bg-gray-100 px-3 py-2 rounded-md w-full font-medium text-gray-700 hover:text-blue-600 text-base text-left"
          >
            Gramática
            <svg
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': showGramaticaMobile }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Submenu Gramática Mobile -->
          <div v-show="showGramaticaMobile" class="space-y-1 mt-1 ml-4">
            <button
              @click="openModal('conjugations')"
              class="block hover:bg-blue-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-blue-600 text-sm text-left"
            >
              📋 Conjugaciones
            </button>
            <button
              @click="openModal('vowels')"
              class="block hover:bg-green-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-green-600 text-sm text-left"
            >
              🔊 Vocales
            </button>
            <button
              @click="openModal('consonants')"
              class="block hover:bg-indigo-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-indigo-600 text-sm text-left"
            >
              🎵 Consonantes
            </button>
            <button
              @click="openModal('gender')"
              class="block hover:bg-pink-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-pink-600 text-sm text-left"
            >
              👥 Género
            </button>
            <button
              @click="openModal('pronouns')"
              class="block hover:bg-teal-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-teal-600 text-sm text-left"
            >
              💬 Pronombres
            </button>
            <button
              @click="openModal('accusative')"
              class="block hover:bg-purple-50 px-3 py-2 rounded-md w-full text-gray-600 hover:text-purple-600 text-sm text-left"
            >
              📖 Acusativo
            </button>
          </div>
        </div>

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

    <!-- Componente HelpModals para proporcionar acceso a los modales -->
    <HelpModals ref="helpModalsRef" />
  </div>
</template>

<script setup>
const { user, logout } = useAuth()

// Estados para los menús desplegables (Desktop)
const showVocabularioMenu = ref(false)
const showVerbosSubmenu = ref(false)
const showNounsSubmenu = ref(false)
const showGramaticaMenu = ref(false)

// Estados para los menús desplegables (Mobile)
const showVocabularioMobile = ref(false)
const showVerbosMobile = ref(false)
const showNounsMobile = ref(false)
const showGramaticaMobile = ref(false)

// Usar el composable para abrir los modales
const { openModal: openGrammarModal } = useGrammarModals()

const openModal = (modalType) => {
  // Cerrar el menú móvil si está abierto
  showGramaticaMobile.value = false
  showGramaticaMenu.value = false

  // Abrir el modal usando el composable
  openGrammarModal(modalType)
}

const handleLogout = () => {
  logout()
}
</script>

