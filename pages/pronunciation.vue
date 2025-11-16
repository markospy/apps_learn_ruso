<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Traducir/Oír/Leer</h1>
      <p class="text-gray-600">Escribe texto en ruso, tradúcelo y escucha su pronunciación</p>
      <p v-if="isSpeechRecognitionSupported()" class="mt-2 text-blue-600 text-sm">
        🎤 Usa el botón de micrófono en cada oración o el botón "Grabar texto completo" para grabar tu pronunciación y recibir retroalimentación
      </p>
      <p v-else class="mt-2 text-yellow-600 text-sm">
        ⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para grabar tu pronunciación.
      </p>
    </div>

    <div class="p-6 card">
      <!-- Grid de 2 columnas: Input y Todo lo demás -->
      <div class="gap-4 grid grid-cols-2 mb-6">
        <!-- Columna 1: Input (Texto en ruso) -->
        <div class="relative flex flex-col">
          <div class="relative">
            <textarea
              v-model="inputText"
              placeholder="Escribe o pega texto en ruso aquí..."
              class="flex-1 pr-32 min-h-[200px] max-h-[400px] overflow-y-auto font-mono text-lg resize-none input-field"
              rows="10"
            ></textarea>
            <!-- Botones en la esquina superior derecha del textarea -->
            <div class="top-2 right-2 z-10 absolute flex flex-col gap-2">
              <!-- Botón para escuchar el texto completo -->
              <button
                @click="playFullText(inputText.trim())"
                :disabled="!inputText.trim()"
                class="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 shadow-md px-2 py-1.5 rounded text-white text-xs transition-colors disabled:cursor-not-allowed"
                title="Escuchar texto completo"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                <span>Escuchar</span>
              </button>

              <!-- Botón de micrófono para evaluar pronunciación del texto completo -->
              <button
                v-if="!isRecordingFullText"
                @click="handleStartRecordingFullText"
                :disabled="!isSpeechRecognitionSupported() || isRecording !== null || isRecordingFullText || !inputText.trim()"
                class="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 shadow-md px-2 py-1.5 rounded text-white text-xs transition-colors disabled:cursor-not-allowed"
                :title="!isSpeechRecognitionSupported() ? 'Tu navegador no soporta reconocimiento de voz' : 'Grabar pronunciación del texto completo'"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                </svg>
                <span>Grabar</span>
              </button>

              <button
                v-else
                @click="handleStopRecordingFullText"
                class="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 shadow-md px-2 py-1.5 rounded text-white text-xs transition-colors"
                title="Detener grabación"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
                </svg>
                <span>Detener</span>
              </button>

              <!-- Indicador cuando está grabando texto completo -->
              <p v-if="isRecordingFullText" class="text-blue-600 text-xs text-center italic animate-pulse">
                🎤 Escuchando...
              </p>
            </div>
          </div>
        </div>

        <!-- Columna 2: Transliteración, Escucha, Traducción, Grabación y Evaluación -->
        <div class="flex flex-col">
          <div class="flex-1 bg-gray-50 p-4 border border-gray-300 rounded min-h-[200px] max-h-[305px] overflow-y-auto">
            <div v-if="inputText.trim()" class="space-y-4">
              <div
                v-for="(sentence, sentenceIndex) in processedSentences"
                :key="sentenceIndex"
                class="pb-4 border-gray-200 border-b last:border-b-0"
              >
                <!-- Oración original con botones de acción -->
                <div class="mb-2">
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <p
                      @click="playLine(sentence.original, sentenceIndex)"
                      class="flex-1 font-medium text-gray-800 hover:text-blue-600 text-lg transition-colors cursor-pointer"
                    >
                      {{ sentence.original || '(oración vacía)' }}
                    </p>
                    <!-- Botones de acción: Escuchar y Grabar -->
                    <div class="flex flex-shrink-0 gap-2">
                      <button
                        @click.stop="playLine(sentence.original, sentenceIndex)"
                        class="bg-blue-500 hover:bg-blue-600 p-1.5 rounded text-white transition-colors"
                        title="Escuchar oración"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button
                        v-if="isRecording !== sentenceIndex"
                        @click.stop="handleStartRecording(sentenceIndex, sentence.original)"
                        :disabled="!isSpeechRecognitionSupported() || isRecording !== null || isRecordingFullText"
                        class="bg-red-500 hover:bg-red-600 disabled:opacity-50 p-1.5 rounded text-white transition-colors disabled:cursor-not-allowed"
                        :title="!isSpeechRecognitionSupported() ? 'Tu navegador no soporta reconocimiento de voz' : (isRecordingFullText ? 'Hay una grabación del texto completo en curso' : 'Grabar pronunciación')"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button
                        v-else
                        @click.stop="handleStopRecording"
                        class="bg-gray-600 hover:bg-gray-700 p-1.5 rounded text-white transition-colors"
                        title="Detener grabación"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Indicador cuando está grabando -->
                  <p v-if="isRecording === sentenceIndex" class="mb-2 text-blue-600 text-sm italic animate-pulse">
                    🎤 Habla ahora... El sistema está escuchando
                  </p>
                </div>

                <!-- Transliteración -->
                <div class="mb-2">
                  <p class="mb-1 font-medium text-gray-500 text-xs">Transliteración:</p>
                  <p class="text-gray-600 text-sm italic">
                    {{ sentence.transliteration || '' }}
                  </p>
                </div>

                <!-- Traducción -->
                <div class="mb-2">
                  <p class="mb-1 font-medium text-gray-500 text-xs">Traducción:</p>
                  <p v-if="sentence.translation" class="text-green-600 text-base">
                    {{ sentence.translation }}
                  </p>
                  <p v-else class="text-gray-400 text-sm italic">
                    Traduciendo...
                  </p>
                </div>

                <!-- Palabras individuales clickeables -->
                <div v-if="sentence.words && sentence.words.length > 0" class="mb-2">
                  <p class="mb-1 font-medium text-gray-500 text-xs">Palabras (click para escuchar):</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(word, wordIndex) in sentence.words"
                      :key="wordIndex"
                      @click.stop="playWord(word.text)"
                      class="bg-gray-100 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                      :title="word.transliteration"
                    >
                      {{ word.text }}
                    </span>
                  </div>
                </div>

                <!-- Resultado de la evaluación con texto reconocido -->
                <div v-if="recordingResults[sentenceIndex]" class="bg-white mt-3 p-3 border border-gray-200 rounded">
                  <div class="flex justify-between items-center mb-2">
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

                  <div v-else-if="recordingResults[sentenceIndex].recognized" class="space-y-2">
                    <div>
                      <p class="mb-1 font-medium text-gray-500 text-xs">Lo que se entendió del audio:</p>
                      <p class="bg-gray-50 p-2 border border-gray-200 rounded text-gray-800 text-sm italic">
                        "{{ recordingResults[sentenceIndex].recognized }}"
                      </p>
                    </div>
                    <div>
                      <p class="mb-1 font-medium text-gray-500 text-xs">Texto esperado:</p>
                      <p class="bg-gray-50 p-2 rounded text-gray-600 text-sm">
                        "{{ sentence.original }}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex justify-center items-center h-full text-gray-400 text-sm">
              Escribe texto en ruso para ver la transliteración, traducción y opciones de grabación
            </div>
          </div>
        </div>
      </div>

      <!-- Resultado de la evaluación del texto completo -->
      <div v-if="fullTextRecordingResult" class="bg-gray-50 mb-4 p-4 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-semibold text-gray-700">Evaluación del texto completo:</h4>
            <button
              @click="clearFullTextRecordingResult"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="Limpiar resultado"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'font-semibold text-base',
                  fullTextRecordingResult.accuracy >= 80
                    ? 'text-green-600'
                    : fullTextRecordingResult.accuracy >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                ]"
              >
                Precisión: {{ fullTextRecordingResult.accuracy }}%
              </span>
            </div>

            <div v-if="fullTextRecordingResult.error" class="text-red-600 text-sm italic">
              {{ fullTextRecordingResult.error }}
            </div>

            <div v-else-if="fullTextRecordingResult.recognized" class="space-y-3">
              <!-- Texto esperado con botón de reproducir -->
              <div class="flex items-end gap-2">
                <div class="flex-1">
                  <p class="mb-1 text-gray-600 text-sm">
                    <span class="font-medium">Esperado:</span>
                  </p>
                  <p class="bg-white p-2 border border-gray-200 rounded text-gray-800 text-base">
                    "{{ inputText.trim() }}"
                  </p>
                </div>
                <button
                  @click="playFullText(inputText.trim())"
                  class="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-white text-sm transition-colors"
                  title="Escuchar texto esperado"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <span>Escuchar</span>
                </button>
              </div>

              <!-- Texto reconocido con botón de reproducir -->
              <div class="flex items-end gap-2">
                <div class="flex-1">
                  <p class="mb-1 text-gray-600 text-sm">
                    <span class="font-medium">Reconocido:</span>
                  </p>
                  <p class="bg-white p-2 border border-gray-200 rounded text-gray-800 text-base">
                    "{{ fullTextRecordingResult.recognized }}"
                  </p>
                </div>
                <button
                  @click="playFullText(fullTextRecordingResult.recognized)"
                  class="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-2 rounded text-white text-sm transition-colors"
                  title="Escuchar tu grabación"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <span>Escuchar</span>
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay texto -->
    <div v-if="!inputText.trim()" class="py-12 text-gray-500 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <p class="text-lg">Escribe texto en ruso arriba para ver su transliteración</p>
        <p class="mt-2 text-sm">Haz clic en las líneas o palabras para escuchar su pronunciación</p>
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
  isRecordingFullText,
  fullTextRecordingResult,
  isSpeechRecognitionSupported,
  startRecording,
  stopRecording,
  clearRecordingResult,
  startRecordingFullText,
  stopRecordingFullText,
  clearFullTextRecordingResult
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

// Reproducir texto completo
const playFullText = (text) => {
  if (!text || !text.trim()) return
  speak(text)
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

// Manejar inicio de grabación del texto completo
const handleStartRecordingFullText = async () => {
  if (!inputText.value || !inputText.value.trim()) {
    alert('No hay texto para evaluar')
    return
  }

  try {
    await startRecordingFullText(inputText.value.trim())
  } catch (error) {
    // El error ya se maneja en el composable y se muestra en fullTextRecordingResult
    console.error('Error al grabar texto completo:', error)
  }
}

// Manejar detención de grabación del texto completo
const handleStopRecordingFullText = () => {
  stopRecordingFullText()
}
</script>

