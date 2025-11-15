<template>
  <Teleport to="body">
    <!-- Modal de pronunciación de consonantes -->
    <div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
      <div class="bg-white shadow-xl rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
          <h3 class="font-bold text-gray-800 text-2xl">Pronunciación de Consonantes</h3>
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

          <h3 class="mb-4 font-bold text-gray-800 text-xl">1. Palatalización (Dura vs. Suave)</h3>

          <div class="gap-6 grid md:grid-cols-2">
            <!-- Consonantes que pueden ser Duras -->
            <div class="bg-blue-50 p-4 border-2 border-blue-200 rounded-lg">
              <h4 class="mb-3 font-bold text-gray-800 text-lg">Consonantes Duras</h4>
              <p class="mb-4 text-gray-600 text-sm italic">
                La pronunciación estándar; ocurre antes de <span class="font-extrabold text-blue-700">а, о, у, ы</span> o al final de una palabra.
              </p>
              <div class="bg-white p-4 border border-blue-100 rounded">
                <p class="mb-2 font-semibold text-gray-700 text-sm">Consonantes Variables:</p>
                <p class="mb-2 font-bold text-gray-800 text-lg">б, в, г, д, з, к, л, м, н, п, р, с, т, ф, х</p>
                <p class="mt-3 text-gray-700 text-sm">
                  <strong>Ejemplos:</strong> <span class="font-medium">стол</span> (stól), <span class="font-medium">дом</span> (dom), <span class="font-medium">ты</span> (ty)
                </p>
              </div>
            </div>

            <!-- Consonantes que pueden ser Suaves -->
            <div class="bg-green-50 p-4 border-2 border-green-200 rounded-lg">
              <h4 class="mb-3 font-bold text-gray-800 text-lg">Consonantes Suaves</h4>
              <p class="mb-4 text-gray-600 text-sm italic">
                Ocurre antes de <span class="font-extrabold text-green-700">е, ё, и, ю, я</span> o cuando la sigue un signo suave (<span class="font-extrabold text-green-700">ь</span>).
              </p>
              <div class="bg-white p-4 border border-green-100 rounded">
                <p class="mb-2 font-semibold text-gray-700 text-sm">Mismo conjunto (usamos <span class="font-mono">'</span> para indicar suavidad):</p>
                <p class="mb-2 font-bold text-gray-800 text-lg">б', в', г', д', з', к', л', м', н', п', р', с', т', ф', х'</p>
                <p class="mt-3 text-gray-700 text-sm">
                  <strong>Ejemplos:</strong> <span class="font-medium">место</span> (m'ést-o), <span class="font-medium">день</span> (d'eń'), <span class="font-medium">мясо</span> (m'áso)
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4 mt-6">
            <!-- Consonantes Siempre Duras -->
            <div class="bg-yellow-50 p-4 border-2 border-yellow-300 rounded-lg">
              <h4 class="mb-3 font-bold text-gray-800 text-lg">Consonantes Siempre Duras</h4>
              <p class="mb-2 text-gray-700 text-sm">
                <strong>Estas consonantes nunca se suavizan:</strong>
              </p>
              <p class="font-bold text-gray-800 text-lg">ж, ш, ц</p>
              <p class="mt-2 text-gray-700 text-sm">
                <strong>Ejemplos:</strong> <span class="font-medium">жар</span> (zhar), <span class="font-medium">шар</span> (shar), <span class="font-medium">центр</span> (tsentr)
              </p>
            </div>

            <!-- Consonantes Siempre Suaves -->
            <div class="bg-orange-50 p-4 border-2 border-orange-300 rounded-lg">
              <h4 class="mb-3 font-bold text-gray-800 text-lg">Consonantes Siempre Suaves</h4>
              <p class="mb-2 text-gray-700 text-sm">
                <strong>Estas consonantes nunca se pronuncian duras:</strong>
              </p>
              <p class="font-bold text-gray-800 text-lg">ч, щ, й</p>
              <p class="mt-2 text-gray-700 text-sm">
                <strong>Ejemplos:</strong> <span class="font-medium">час</span> (chás), <span class="font-medium">щука</span> (shchúka), <span class="font-medium">йогурт</span> (yogurt)
              </p>
            </div>
          </div>

          <h3 class="mt-8 mb-4 font-bold text-gray-800 text-xl">2. Regla de la Voz (Asimilación por Sonoridad)</h3>

          <p class="mb-4 text-gray-700 text-sm">
            Las consonantes sonoras y sordas se influyen mutuamente según el sonido que las sigue (Asimilación).
          </p>

          <!-- A. Devoicing (Sonoro → Sordo) - Al final de palabra o antes de Sorda -->
          <div class="bg-purple-50 mb-6 p-4 border-2 border-purple-300 rounded-lg">
            <h4 class="mb-3 font-bold text-gray-800 text-lg">A. Al final de palabra o antes de Sorda (Sordez / Devoicing)</h4>
            <p class="mb-2 text-gray-700 text-sm">
              La consonante <strong class="text-purple-700">Sonora</strong> se pronuncia como su par <strong class="text-purple-700">Sordo</strong>.
            </p>

            <div class="bg-white mt-3 p-3 border border-purple-100 rounded">
              <p class="font-semibold text-gray-700 text-sm">Pares Sonoro <span class="font-bold text-purple-700">→</span> Sordo:</p>
              <p class="font-bold text-gray-800 text-lg">Б <span class="font-bold text-purple-700">→</span> П | В <span class="font-bold text-purple-700">→</span> Ф | Г <span class="font-bold text-purple-700">→</span> К | Д <span class="font-bold text-purple-700">→</span> Т | З <span class="font-bold text-purple-700">→</span> С | Ж <span class="font-bold text-purple-700">→</span> Ш</p>
            </div>

            <p class="mt-3 text-gray-700 text-sm">
              <strong>Ejemplos:</strong> Хлеб (khléb) se pronuncia [khlé<strong class="font-extrabold">p</strong>]; Год (gód) se pronuncia [gó<strong class="font-extrabold">t</strong>].
            </p>
          </div>

          <!-- B. Voicing (Sordo → Sonoro) - Antes de Consonante Sonora -->
          <div class="bg-pink-50 p-4 border-2 border-pink-300 rounded-lg">
            <h4 class="mb-3 font-bold text-gray-800 text-lg">B. Antes de Consonante Sonora (Ensonorización / Voicing)</h4>
            <p class="mb-2 text-gray-700 text-sm">
              La consonante <strong class="text-pink-700">Sorda</strong> se pronuncia como su par <strong class="text-pink-700">Sonoro</strong> (excepto ante л, м, н, р, й, в).
            </p>
            <div class="bg-white mt-3 p-3 border border-pink-100 rounded">
              <p class="font-semibold text-gray-700 text-sm">Pares Sordo <span class="font-bold text-pink-700">→</span> Sonoro:</p>
              <p class="font-bold text-gray-800 text-lg">П <span class="font-bold text-pink-700">→</span> Б | Ф <span class="font-bold text-pink-700">→</span> В | К <span class="font-bold text-pink-700">→</span> Г | Т <span class="font-bold text-pink-700">→</span> Д | С <span class="font-bold text-pink-700">→</span> З | Ш <span class="font-bold text-pink-700">→</span> Ж</p>
            </div>
            <p class="mt-3 text-gray-700 text-sm">
              <strong>Ejemplos:</strong> Фу<strong class="font-extrabold">т</strong>бол (fútbol) se pronuncia [фу<strong class="font-extrabold">д</strong>бол]; Э<strong class="font-extrabold">к</strong>замен (examen) se pronuncia [и<strong class="font-extrabold">г</strong>за́мин].
            </p>
          </div>

          <h3 class="mt-8 mb-4 font-bold text-gray-800 text-xl">3. Reglas Especiales (Ч y Щ)</h3>

          <div class="bg-indigo-50 p-4 border-2 border-indigo-300 rounded-lg">
            <h4 class="mb-3 font-bold text-gray-800 text-lg">Reducción Vocálica en <span class="font-extrabold text-indigo-700">ЧА → [ЧИ]</span> y <span class="font-extrabold text-indigo-700">ЩА → [ЩИ]</span></h4>
            <p class="mb-2 text-gray-700 text-sm">
              Por regla ortográfica, las consonantes siempre suaves <span class="font-extrabold text-indigo-700">ч</span> y <span class="font-extrabold text-indigo-700">щ</span> van seguidas de <span class="font-extrabold text-indigo-700">а</span> (<span class="font-extrabold text-indigo-700">ча</span>, <span class="font-extrabold text-indigo-700">ща</span>) y no de я.
            </p>
            <ul class="ml-4 text-gray-700 text-sm list-disc list-inside">
                <li><span class="font-semibold">En sílaba átona (sin acento)</span>: la vocal А se reduce y se pronuncia como una <span class="font-bold">И</span>.</li>
                <li><span class="font-semibold">En sílaba tónica (con acento)</span>: se pronuncia la А normalmente.</li>
            </ul>

            <p class="mt-3 text-gray-700 text-sm">
              <strong>Ejemplo (Átona):</strong> <span class="font-medium">часы́</span> (reloj) se pronuncia [ч<strong class="font-extrabold">и</strong>сы́].
            </p>
            <p class="mt-1 text-gray-700 text-sm">
              <strong>Ejemplo (Tónica):</strong> <span class="font-medium">ча́й</span> (té) se pronuncia [ча́й].
            </p>
          </div>

          <div class="bg-blue-50 mt-6 p-4 border border-blue-200 rounded-lg">
            <p class="text-gray-700 text-sm">
              <strong>Recuerda:</strong> La pronunciación rusa es fonéticamente precisa, y una consonante dura o suave puede cambiar el significado de una palabra. ¡Practica las terminaciones y el ablandamiento!
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

