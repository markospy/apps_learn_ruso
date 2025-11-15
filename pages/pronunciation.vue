<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Traducir/Oír</h1>
      <p class="text-gray-600">Escribe texto en ruso, tradúcelo y escucha su pronunciación</p>
    </div>

    <div class="p-6 card">
      <!-- Textarea para ingresar texto -->
      <div class="mb-6">
        <label class="block mb-2 font-medium text-gray-700 text-sm">
          Escribe texto en ruso:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Escribe o pega texto en ruso aquí..."
          class="min-h-[200px] font-mono text-lg input-field"
          rows="8"
        ></textarea>
      </div>

      <!-- Resultado con transliteración y traducción -->
      <div v-if="inputText.trim()" class="space-y-4">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-gray-700 text-lg">Resultado:</h3>
          <p v-if="isTranslating" class="text-blue-600 text-sm italic">Traduciendo...</p>
        </div>

        <!-- Oraciones procesadas -->
        <div
          v-for="(sentence, sentenceIndex) in processedSentences"
          :key="sentenceIndex"
          class="pb-4 border-gray-200 border-b last:border-b-0"
        >
          <!-- Oración completa clickeable -->
          <div
            @click="playLine(sentence.original, sentenceIndex)"
            class="group hover:bg-blue-50 p-4 rounded-lg transition-colors cursor-pointer"
          >
            <p class="mb-2 font-medium text-gray-800 group-hover:text-blue-600 text-xl">
              {{ sentence.original || '(oración vacía)' }}
            </p>
            <p class="mb-2 text-gray-500 text-sm italic">
              {{ sentence.transliteration || '' }}
            </p>
            <p v-if="sentence.translation" class="font-medium text-green-600 text-base">
              {{ sentence.translation }}
            </p>
          </div>

          <!-- Palabras individuales -->
          <div v-if="sentence.words && sentence.words.length > 0" class="flex flex-wrap gap-2 mt-3 px-4">
            <span
              v-for="(word, wordIndex) in sentence.words"
              :key="wordIndex"
              @click.stop="playWord(word.text)"
              class="bg-gray-100 hover:bg-blue-100 px-3 py-1 rounded text-sm transition-colors cursor-pointer"
              :title="word.transliteration"
            >
              {{ word.text }}
            </span>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay texto -->
      <div v-else class="py-12 text-gray-500 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <p class="text-lg">Escribe texto en ruso arriba para ver su transliteración</p>
        <p class="mt-2 text-sm">Haz clic en las líneas o palabras para escuchar su pronunciación</p>
      </div>
    </div>

    <!-- Botones de ayuda -->
    <HelpModals />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { speak, processText, translateSentences } = usePronunciation()

const inputText = ref('')
const processedSentences = ref([])
const isTranslating = ref(false)

// Función para procesar y traducir texto con debounce
let debounceTimer = null

const processAndTranslate = async (text) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(async () => {
    if (!text.trim()) {
      processedSentences.value = []
      return
    }

    // Primero procesar transliteración (síncrono)
    processedSentences.value = processText(text)

    // Luego traducir automáticamente (asíncrono)
    isTranslating.value = true
    try {
      processedSentences.value = await translateSentences(processedSentences.value, 'ru', 'es')
    } catch (error) {
      console.error('Error al traducir:', error)
    } finally {
      isTranslating.value = false
    }
  }, 1000) // Debounce de 1 segundo
}

// Procesar y traducir texto automáticamente
watch(inputText, (newText) => {
  processAndTranslate(newText)
})

// Reproducir línea completa
const playLine = (text, lineIndex) => {
  if (!text || !text.trim()) return
  speak(text)
}

// Reproducir palabra individual
const playWord = (word) => {
  if (!word || !word.trim()) return
  speak(word)
}
</script>

