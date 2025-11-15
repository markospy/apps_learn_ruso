<template>
  <Teleport to="body">
    <!-- Modal de pronombres personales y posesivos -->
    <div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
    <div class="bg-white shadow-xl rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      <div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
        <h3 class="font-bold text-gray-800 text-2xl">Pronombres Personales y Posesivos</h3>
        <button
          @click="showModal = false"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6">
        <div class="gap-6 grid md:grid-cols-2">
          <!-- Pronombres Personales -->
          <div class="bg-blue-50 p-4 border-2 border-blue-200 rounded-lg">
            <h4 class="mb-4 font-bold text-gray-800 text-lg text-center">Pronombres Personales</h4>
            <div class="overflow-x-auto">
              <table class="border border-gray-300 w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-blue-100">
                    <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Ruso</th>
                    <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Español</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Я</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Yo</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Ты</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Tú</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Он</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Él</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Она</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Ella</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Оно</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Ello</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Мы</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Nosotros/Nosotras</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Вы</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Usted/Ustedes</td>
                  </tr>
                  <tr class="hover:bg-blue-100">
                    <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">Они</td>
                    <td class="px-3 py-2 border border-gray-300 text-gray-700">Ellos/Ellas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pronombres Posesivos -->
          <div class="bg-green-50 p-4 border-2 border-green-200 rounded-lg">
            <h4 class="mb-4 font-bold text-gray-800 text-lg text-center">Pronombres Posesivos</h4>

            <div class="mb-4">
              <p class="mb-2 font-semibold text-gray-700 text-sm">Singular:</p>
              <div class="overflow-x-auto">
                <table class="border border-gray-300 w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-green-100">
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Masculino</th>
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Femenino</th>
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Neutro</th>
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Español</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">мой</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">моя</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">моё</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">mi/mío</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">твой</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">твоя</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">твоё</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">tu/tuyo</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">его</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">его</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">его</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">su/suyo (de él)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">её</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">её</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">её</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">su/suyo (de ella)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">наш</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">наша</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">наше</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">nuestro</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">ваш</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">ваша</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">ваше</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">vuestro/su (de ustedes)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">их</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">их</td>
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">их</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">su/suyo (de ellos)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p class="mb-2 font-semibold text-gray-700 text-sm">Plural:</p>
              <div class="overflow-x-auto">
                <table class="border border-gray-300 w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-green-100">
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Ruso</th>
                      <th class="px-3 py-2 border border-gray-300 font-semibold text-gray-700 text-left">Español</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">мои</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">mis/míos</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">твои</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">tus/tuyos</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">его</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">sus/suyos (de él)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">её</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">sus/suyos (de ella)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">наши</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">nuestros</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">ваши</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">vuestros/sus (de ustedes)</td>
                    </tr>
                    <tr class="hover:bg-green-100">
                      <td class="px-3 py-2 border border-gray-300 font-medium text-gray-800">их</td>
                      <td class="px-3 py-2 border border-gray-300 text-gray-700">sus/suyos (de ellos)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Nota adicional -->
        <div class="bg-yellow-50 mt-6 p-4 border border-yellow-200 rounded-lg">
          <p class="text-gray-700 text-sm">
            <strong>Nota importante:</strong> Los pronombres posesivos en ruso concuerdan en género y número con el objeto poseído, no con el poseedor.
          </p>
          <p class="mt-2 text-gray-700 text-sm">
            <strong>Ejemplo:</strong> "моя книга" (mi libro - femenino) vs "мой стол" (mi mesa - masculino)
          </p>
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
const showModal = ref(false)

// Exponer método para abrir el modal desde el componente padre
defineExpose({
  open: () => { showModal.value = true },
  close: () => { showModal.value = false }
})

// Cerrar con tecla Escape
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    showModal.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

