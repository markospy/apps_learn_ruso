<template>
  <div>
    <div class="mb-8">
      <h1 class="mb-2 font-bold text-gray-800 text-4xl">Traductor de Pronunciación</h1>
      <p class="text-gray-600">Escribe texto en ruso y escucha su pronunciación</p>
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

      <!-- Toggle modo de reproducción -->
      <div class="flex justify-between items-center bg-gray-50 mb-6 p-4 rounded-lg">
        <label class="flex items-center gap-3 cursor-pointer">
          <span class="font-medium text-gray-700 text-sm">Modo de reproducción:</span>
          <div class="inline-block relative w-14 h-7">
            <input
              type="checkbox"
              v-model="playFullSentence"
              class="sr-only peer"
              id="playModeToggle"
            />
            <label
              for="playModeToggle"
              class="absolute inset-0 bg-gray-300 peer-checked:bg-blue-500 rounded-full transition-colors cursor-pointer"
            >
              <span
                class="top-0.5 left-0.5 absolute bg-white rounded-full w-6 h-6 transition-transform peer-checked:translate-x-7"
              ></span>
            </label>
          </div>
          <span class="text-gray-600 text-sm">
            {{ playFullSentence ? 'Oración completa' : 'Palabra individual' }}
          </span>
        </label>
      </div>

      <!-- Resultado con transliteración -->
      <div v-if="inputText.trim()" class="space-y-4">
        <h3 class="mb-3 font-semibold text-gray-700 text-lg">Resultado:</h3>

        <div
          v-for="(line, lineIndex) in processedLines"
          :key="lineIndex"
          class="pb-4 border-gray-200 border-b last:border-b-0"
        >
          <!-- Línea completa clickeable -->
          <div
            @click="playLine(line.original, lineIndex)"
            class="group hover:bg-blue-50 p-4 rounded-lg transition-colors cursor-pointer"
          >
            <p class="mb-2 font-medium text-gray-800 group-hover:text-blue-600 text-xl">
              {{ line.original || '(línea vacía)' }}
            </p>
            <p class="text-gray-500 text-sm italic">
              {{ line.transliteration || '' }}
            </p>
          </div>

          <!-- Palabras individuales -->
          <div v-if="line.words && line.words.length > 0" class="flex flex-wrap gap-2 mt-3 px-4">
            <span
              v-for="(word, wordIndex) in line.words"
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

const { speak, processText } = usePronunciation()

const inputText = ref('')
const playFullSentence = ref(true)

// Procesar texto para mostrar transliteración
const processedLines = computed(() => {
  return processText(inputText.value)
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

