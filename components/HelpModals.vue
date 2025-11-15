<template>
  <div>
    <!-- Botones flotantes de ayuda -->
    <div class="top-6 right-6 z-40 fixed flex flex-col gap-2">
      <button
        @click="showConjugationHelp = true"
        class="flex justify-center items-center bg-blue-100 hover:bg-blue-200 shadow-lg rounded-full w-12 h-12 text-blue-600 transition-colors"
        title="Ver tabla de conjugaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <button
        @click="showVowelsHelp = true"
        class="flex justify-center items-center bg-green-100 hover:bg-green-200 shadow-lg rounded-full w-12 h-12 text-green-600 transition-colors"
        title="Ver pronunciación de vocales"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
    </div>

    <!-- Modal de Conjugaciones -->
    <Teleport to="body">
      <div
        v-if="showConjugationHelp"
        class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
        @click.self="showConjugationHelp = false"
      >
        <div class="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
            <h3 class="font-bold text-gray-800 text-2xl">Tabla de Conjugaciones Rusas</h3>
            <button
              @click="showConjugationHelp = false"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="border border-gray-300 w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-blue-50">
                    <th class="px-4 py-3 border border-gray-300 font-semibold text-gray-700 text-left">Pronombre</th>
                    <th class="px-4 py-3 border border-gray-300 font-semibold text-gray-700 text-left">Español</th>
                    <th class="px-4 py-3 border border-gray-300 font-semibold text-gray-700 text-left">1ª Conjugación<br><span class="font-normal text-gray-600 text-xs">(Verbos en -ать, -еть)</span></th>
                    <th class="px-4 py-3 border border-gray-300 font-semibold text-gray-700 text-left">2ª Conjugación<br><span class="font-normal text-gray-600 text-xs">(Verbos en -ить)</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Я</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Yo</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −у o −ю</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −у o −ю</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Ты</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Tú</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ешь o −ёшь</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ишь</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Он/Она/Оно</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Él/Ella/Ello</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ет o −ёт</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ит</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Мы</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Nosotros</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ем o −ём</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −им</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Вы</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Usted/Ustedes</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ете o −ёте</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ите</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Они</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Ellos/Ellas</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ут o −ют</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ат o −ят</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-blue-50 mt-6 p-4 rounded-lg">
              <p class="text-gray-700 text-sm">
                <strong>Nota:</strong> La raíz del verbo se obtiene eliminando la terminación del infinitivo.
                Por ejemplo, para "работать" (trabajar), la raíz es "работа".
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Vocales -->
      <div
        v-if="showVowelsHelp"
        class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
        @click.self="showVowelsHelp = false"
      >
        <div class="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
            <h3 class="font-bold text-gray-800 text-2xl">Pronunciación de Vocales</h3>
            <button
              @click="showVowelsHelp = false"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <p class="mb-6 text-gray-700">
              Las vocales <strong>Е, Ё, Ю, Я</strong> se pronuncian diferente según su posición en la palabra.
            </p>
            <div class="space-y-4">
              <div class="bg-blue-50 p-4 border-2 border-blue-200 rounded-lg">
                <h4 class="mb-2 font-bold text-gray-800 text-lg">Al principio de palabra</h4>
                <ul class="space-y-2 text-gray-700">
                  <li><strong>Е</strong> = [йэ] → "ye"</li>
                  <li><strong>Ё</strong> = [йо] → "yó"</li>
                  <li><strong>Ю</strong> = [йу] → "yu"</li>
                  <li><strong>Я</strong> = [йа] → "ya"</li>
                </ul>
              </div>
              <div class="bg-green-50 p-4 border-2 border-green-200 rounded-lg">
                <h4 class="mb-2 font-bold text-gray-800 text-lg">Después de consonante</h4>
                <p class="mb-2 text-gray-700 text-sm">La consonante se suaviza y la vocal suena sin "й"</p>
                <ul class="space-y-2 text-gray-700">
                  <li><strong>ме</strong> = [м'э]</li>
                  <li><strong>мё</strong> = [м'о]</li>
                  <li><strong>мю</strong> = [м'у]</li>
                  <li><strong>мя</strong> = [м'а]</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const showConjugationHelp = ref(false)
const showVowelsHelp = ref(false)

// Cerrar con tecla Escape
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    showConjugationHelp.value = false
    showVowelsHelp.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

