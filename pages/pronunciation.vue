<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Traducir/Oír/Leer</h1>
      <p class="text-gray-600">Escribe texto en ruso, tradúcelo y escucha su pronunciación</p>
      <p v-if="isSpeechRecognitionSupported()" class="mt-2 text-blue-600 text-sm">
        🎤 Usa el botón de micrófono en cada oración para grabar tu pronunciación y recibir retroalimentación
      </p>
      <p v-else class="mt-2 text-yellow-600 text-sm">
        ⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para grabar tu pronunciación.
      </p>
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
          class="flex justify-between items-center pb-4 border-gray-200 border-b last:border-b-0"
        >
          <!-- Oración completa clickeable -->
          <div>
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

          <!-- Botón de micrófono para grabar y evaluar pronunciación -->
          <div class="flex flex-col justify-center gap-3 mt-4 px-4">
            <button
              v-if="isRecording !== sentenceIndex"
              @click.stop="handleStartRecording(sentenceIndex, sentence.original)"
              :disabled="!isSpeechRecognitionSupported() || isRecording !== null"
              class="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-colors disabled:cursor-not-allowed"
              :title="!isSpeechRecognitionSupported() ? 'Tu navegador no soporta reconocimiento de voz' : ''"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
              </svg>
              <span>Grabar pronunciación</span>
            </button>

            <button
              v-else
              @click.stop="handleStopRecording"
              class="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
              </svg>
              <span>Detener</span>
            </button>

            <!-- Resultado de la evaluación -->
            <div v-if="recordingResults[sentenceIndex]" class="flex flex-1 items-center gap-3">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'font-semibold text-sm',
                    recordingResults[sentenceIndex].accuracy >= 80
                      ? 'text-green-600'
                      : recordingResults[sentenceIndex].accuracy >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  ]"
                >
                  Precisión: {{ recordingResults[sentenceIndex].accuracy }}%
                </span>
                <button
                  @click.stop="clearRecordingResult(sentenceIndex)"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Limpiar resultado"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <div v-if="recordingResults[sentenceIndex].error" class="text-red-600 text-sm italic">
                {{ recordingResults[sentenceIndex].error }}
              </div>

              <div v-else-if="recordingResults[sentenceIndex].recognized" class="text-gray-600 text-sm italic">
                Reconocido: "{{ recordingResults[sentenceIndex].recognized }}"
              </div>
            </div>
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

const {
  speak,
  processText,
  translateSentences,
  isRecording,
  recordingResults,
  isSpeechRecognitionSupported,
  startRecording,
  stopRecording,
  clearRecordingResult
} = usePronunciation()

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

// Manejar inicio de grabación
const handleStartRecording = async (sentenceIndex, expectedText) => {
  if (!expectedText || !expectedText.trim()) {
    alert('No hay texto de referencia para comparar')
    return
  }

  try {
    await startRecording(sentenceIndex, expectedText)
  } catch (error) {
    // El error ya se maneja en el composable y se muestra en recordingResults
    console.error('Error al grabar:', error)
  }
}

// Manejar detención de grabación
const handleStopRecording = () => {
  stopRecording()
}
</script>

