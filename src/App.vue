<template>
    <div id="app" class="mx-auto max-w-4xl">
      <h1 class="mb-8 font-bold text-gray-800 text-4xl text-center">
        Conjugación Rusa - Práctica
      </h1>

      <div class="flex justify-center mb-6">
        <button
          @click="activeTab = 'practice'"
          type="button"
          :class="['px-6 py-2 mx-2 text-lg font-medium rounded-t-lg transition duration-200 cursor-pointer',
                   activeTab === 'practice' ? 'bg-blue-500 text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300']">
          Practicar
        </button>
        <button
          @click="switchToManageTab"
          type="button"
          :class="['px-6 py-2 mx-2 text-lg font-medium rounded-t-lg transition duration-200 cursor-pointer',
                   activeTab === 'manage' ? 'bg-blue-500 text-white' : 'text-gray-700 bg-gray-200 hover:bg-gray-300']">
          Administrar Verbos
        </button>

        <!-- Botón de ayuda flotante -->
        <button
          @click="showHelpModal = true"
          class="top-6 right-6 absolute flex justify-center items-center bg-blue-100 hover:bg-blue-200 shadow-md rounded-full w-10 h-10 text-blue-600 transition-colors"
          title="Ver tabla de conjugaciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div v-if="activeTab === 'practice'" class="relative p-6 sm:p-8 card">

        <h2 class="mb-6 pb-2 border-b font-semibold text-gray-700 text-2xl">
          Tarea de Conjugación
        </h2>

        <div v-if="!dbInitialized" class="mb-4 text-gray-500 text-sm text-center">Cargando base de datos local...</div>

        <div v-if="dbInitialized && verbs.length === 0" class="p-8 text-gray-500 text-center">
          <p class="text-xl">Aún no tienes verbos para practicar.</p>
          <p>Ve a la pestaña "Administrar Verbos" para agregar algunos.</p>
        </div>

        <div v-if="dbInitialized && verbs.length > 0" class="space-y-6">
          <div class="flex flex-col items-center bg-blue-50 p-4 rounded-xl">
            <p class="text-gray-600 text-lg">Conjuga el verbo:</p>
            <p class="font-extrabold text-blue-700 text-4xl">{{ currentVerb?.infinitive || '...' }}</p>
            <p class="mt-1 text-gray-500 text-sm">Conjugación {{ currentVerb?.conjugationType }}</p>
          </div>

          <div class="space-y-2">
            <div
              v-for="pronoun in Object.keys(PRONOUNS)"
              :key="pronoun"
              class="flex sm:flex-row flex-col items-center gap-2 bg-gray-50 p-2 rounded-lg"
              :class="{
                'bg-green-50 border-2 border-green-300': checkedAnswers[pronoun] === true,
                'bg-red-50 border-2 border-red-300': checkedAnswers[pronoun] === false
              }"
            >
              <div class="flex-shrink-0 w-24 sm:w-32 sm:text-left text-center">
                <p class="font-bold text-gray-800 text-lg">{{ pronoun }}</p>
                <p class="text-gray-600 text-sm">{{ getPronounSpanish(pronoun) }}</p>
              </div>
              <button
                @click="playPronunciation(pronoun)"
                :disabled="!currentVerb"
                class="flex flex-shrink-0 justify-center items-center bg-blue-100 hover:bg-blue-200 disabled:opacity-50 rounded-lg w-10 h-10 text-blue-600 transition-colors disabled:cursor-not-allowed"
                title="Escuchar pronunciación"
              >
                <svg v-if="!isPlaying[pronoun]" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6m-6 4h6" />
                </svg>
              </button>
              <input
                type="text"
                v-model="userInputs[pronoun]"
                :disabled="checkedAnswers[pronoun] !== null"
                @keyup.enter="checkAnswer(pronoun)"
                placeholder="Escribe la conjugación"
                class="flex-grow p-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg conjugation-input"
                :class="{
                  'border-green-500': checkedAnswers[pronoun] === true,
                  'border-red-500': checkedAnswers[pronoun] === false
                }"
              >
              <button
                @click="checkAnswer(pronoun)"
                :disabled="!currentVerb || checkedAnswers[pronoun] !== null || !userInputs[pronoun]?.trim()"
                class="flex-shrink-0 px-4 py-2 rounded-lg font-bold text-white btn-primary"
              >
                {{ checkedAnswers[pronoun] === null ? 'Comprobar' : checkedAnswers[pronoun] ? '✓' : '✗' }}
              </button>
              <div v-if="checkedAnswers[pronoun] !== null" class="flex-shrink-0 min-w-[200px] text-sm">
                <p v-if="checkedAnswers[pronoun]" class="font-semibold text-green-600">
                  ¡Correcto!
                </p>
                <p v-else class="font-semibold text-red-600">
                  Correcto: <span class="font-bold">{{ conjugate(currentVerb, pronoun) }}</span>
                </p>
              </div>
              <div v-if="currentVerb" class="flex-shrink-0 min-w-[120px] text-gray-500 text-xs italic">
                {{ getPronunciationSpanish(pronoun, conjugate(currentVerb, pronoun)) }}
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              @click="startPractice"
              class="flex-1 py-3 rounded-lg font-bold text-white text-xl btn-primary"
            >
              Nuevo Verbo
            </button>
            <button
              @click="resetPractice"
              class="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-bold text-gray-700 transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'manage'" class="p-6 sm:p-8 card" style="display: block; visibility: visible;">
        <h2 class="mb-6 pb-2 border-b font-semibold text-gray-700 text-2xl">
          Añadir Nuevo Verbo
        </h2>

        <div v-if="!dbInitialized" class="bg-yellow-50 mb-4 p-4 border border-yellow-200 rounded-lg text-yellow-800 text-center">
          <p class="font-medium">Cargando base de datos...</p>
          <p class="mt-1 text-sm">Por favor espera un momento.</p>
        </div>

        <form @submit.prevent="saveVerb" class="space-y-4 mb-8" v-if="dbInitialized">
          <div>
            <label for="infinitive" class="block font-medium text-gray-700 text-sm">Infinitivo (ej: работать)</label>
            <input
              type="text"
              v-model="newVerb.infinitive"
              required
              :disabled="!dbInitialized"
              class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              :class="{ 'opacity-50 cursor-not-allowed': !dbInitialized }"
            >
          </div>
          <div>
            <label for="conjugation-type" class="block font-medium text-gray-700 text-sm">Tipo de Conjugación</label>
            <select
              v-model.number="newVerb.conjugationType"
              required
              :disabled="!dbInitialized"
              class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              :class="{ 'opacity-50 cursor-not-allowed': !dbInitialized }"
            >
              <option :value="1">1ª Conjugación</option>
              <option :value="2">2ª Conjugación</option>
            </select>
          </div>
          <button
            type="submit"
            class="py-2 rounded-lg w-full font-bold text-white btn-primary"
            :disabled="!dbInitialized || !newVerb.infinitive.trim()"
          >
            Añadir Verbo a mi Lista
          </button>
        </form>

        <h2 class="mb-4 pb-2 border-b font-semibold text-gray-700 text-2xl">
          Mi Lista de Verbos (<span id="verb-count">{{ verbs.length }}</span>)
        </h2>

        <div v-if="!dbInitialized" class="p-4 text-gray-500 text-center">
          <p>Cargando verbos...</p>
        </div>
        <div v-else-if="verbs.length === 0" class="p-4 text-gray-500 text-center">
          <p class="text-lg">No hay verbos guardados.</p>
          <p class="mt-2 text-sm">Usa el formulario de arriba para agregar tu primer verbo.</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="verb in verbs" :key="verb.id"
               class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 border-b last:border-b-0 rounded-lg transition-colors">
            <div>
              <p class="font-medium text-gray-800 text-lg">{{ verb.infinitive }}</p>
              <p class="text-gray-500 text-sm">Conjugación: {{ verb.conjugationType }} (Raíz: {{ verb.root }})</p>
            </div>
            <button
              @click="deleteVerb(verb.id)"
              class="hover:bg-red-50 px-4 py-2 rounded font-semibold text-red-500 hover:text-red-700 transition duration-150"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de ayuda con tabla de conjugaciones -->
      <div v-if="showHelpModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showHelpModal = false">
        <div class="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
            <h3 class="font-bold text-gray-800 text-2xl">Tabla de Conjugaciones Rusas</h3>
            <button
              @click="showHelpModal = false"
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
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Tú (inf.)</td>
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
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Nosotros/as</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −ем o −ём</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Raíz + −им</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Вы</td>
                    <td class="px-4 py-3 border border-gray-300 text-gray-700">Usted (f.)/Ustedes (pl.)</td>
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
              <p class="text-gray-700 text-sm">
                <strong>Nota:</strong> Si la raíz es dura (termina en т, д, к, п, м, etc.), se usa la vocal dura (у, е).Si la raíz es suave (termina en ч, ж, ш, щ o vocal), se usa la vocal suave (ю, ё).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
  import { initializeDatabase, addVerb, getVerbs, deleteVerb as deleteVerbFromDb } from './db';
  import { transliterate } from 'transliteration';

  // --- Constantes ---
  const PRONOUNS = {
      'Я': 1, 'Ты': 2, 'Он/Она': 3, 'Мы': 4, 'Вы': 5, 'Они': 6,
  };
  const ENDINGS_1 = {
      1: 'ю', 2: 'ешь', 3: 'ет', 4: 'ем', 5: 'ете', 6: 'ют'
  };
  const ENDINGS_2 = {
      1: 'ю', 2: 'ишь', 3: 'ит', 4: 'им', 5: 'ите', 6: 'ят'
  };

  // --- Estado Reactivo ---
  const activeTab = ref('practice');
  const dbInitialized = ref(false);
  const verbs = ref([]);
  const currentVerb = ref(null);
  const userInputs = reactive({
      'Я': '',
      'Ты': '',
      'Он/Она': '',
      'Мы': '',
      'Вы': '',
      'Они': ''
  });
  const checkedAnswers = reactive({
      'Я': null,
      'Ты': null,
      'Он/Она': null,
      'Мы': null,
      'Вы': null,
      'Они': null
  });
  const isPlaying = reactive({
      'Я': false,
      'Ты': false,
      'Он/Она': false,
      'Мы': false,
      'Вы': false,
      'Они': false
  });
  const showHelpModal = ref(false);
  let currentUtterance = null;

  const newVerb = reactive({
      infinitive: '',
      conjugationType: 1, // Por defecto 1ª conjugación
  });

  // --- Propiedades Calculadas ---
  const allAnswersChecked = computed(() => {
      return Object.values(checkedAnswers).every(answer => answer !== null);
  });

  // --- Lógica de la Base de Datos ---

  // Función para obtener los verbos desde la base de datos local y actualizar el estado
  async function fetchVerbs() {
      verbs.value = await getVerbs();
      // Si la pestaña de práctica está activa, iniciar una nueva práctica si hay verbos
      if (activeTab.value === 'practice' && verbs.value.length > 0 && !currentVerb.value) {
          startPractice();
      }
  }

  // Función para manejar tecla Escape
  const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showHelpModal.value) {
          showHelpModal.value = false;
      }
  };

  // Inicialización
  onMounted(async () => {
      try {
          await initializeDatabase();
          dbInitialized.value = true;
          await fetchVerbs();
      } catch (e) {
          console.error("Error al inicializar la base de datos:", e);
          // Aquí podrías mostrar un mensaje de error al usuario
      }
      // Agregar listener para tecla Escape
      window.addEventListener('keydown', handleEscapeKey);
  });

  // Limpiar listener al desmontar
  onUnmounted(() => {
      window.removeEventListener('keydown', handleEscapeKey);
  });

  // Función para cambiar a la pestaña de administración
  function switchToManageTab() {
      activeTab.value = 'manage';
      console.log('Pestaña cambiada a manage, activeTab:', activeTab.value);
  }

  // Watcher para iniciar la práctica cuando se cambia a la pestaña 'practice'
  watch(activeTab, (newTab) => {
      console.log('activeTab cambió a:', newTab);
      if (newTab === 'practice' && verbs.value.length > 0 && !currentVerb.value) {
          startPractice();
      }
  });


  // --- Lógica CRUD para Verbos ---

  function getVerbRoot(infinitive, type) {
      // Lógica simplificada de extracción de raíz
      infinitive = infinitive.trim();
      if (type === 1) {
          if (infinitive.endsWith('ать') || infinitive.endsWith('ять') || infinitive.endsWith('еть')) {
              return infinitive.substring(0, infinitive.length - 3);
          }
          if (infinitive.endsWith('ть')) {
              return infinitive.substring(0, infinitive.length - 2);
          }
      } else if (type === 2) {
          if (infinitive.endsWith('ить')) {
              return infinitive.substring(0, infinitive.length - 3);
          }
          if (infinitive.endsWith('ть')) {
              return infinitive.substring(0, infinitive.length - 2);
          }
      }
      return infinitive; // Fallback
  }

  async function saveVerb() {
      if (!dbInitialized.value) return;

      const root = getVerbRoot(newVerb.infinitive, newVerb.conjugationType);
      const verbData = {
          infinitive: newVerb.infinitive,
          conjugationType: newVerb.conjugationType,
          root: root,
      };

      try {
          await addVerb(verbData);
          await fetchVerbs(); // Recargar la lista
          newVerb.infinitive = '';
          newVerb.conjugationType = 1;
      } catch (e) {
          alert("Error al añadir el verbo. ¿Ya existe?");
          console.error("Error al añadir verbo:", e);
      }
  }

  async function deleteVerb(id) {
      if (confirm('¿Estás seguro de que quieres eliminar este verbo?')) {
          await deleteVerbFromDb(id);
          await fetchVerbs(); // Recargar la lista
          currentVerb.value = null; // Reiniciar práctica si es necesario
      }
  }

  // --- Lógica de Práctica ---

  function conjugate(verbData, pronoun) {
      const endings = verbData.conjugationType === 1 ? ENDINGS_1 : ENDINGS_2;
      const pronounCode = PRONOUNS[pronoun];
      const ending = endings[pronounCode];
      return verbData.root + ending;
  }

  function startPractice() {
      if (verbs.value.length === 0) {
          currentVerb.value = null;
          return;
      }

      // Detener cualquier audio que esté reproduciéndose
      if (currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          currentUtterance = null;
      }

      // Resetear el estado
      resetPractice();

      // Elegir un verbo aleatorio
      const verbIndex = Math.floor(Math.random() * verbs.value.length);
      currentVerb.value = verbs.value[verbIndex];
  }

  function resetPractice() {
      // Detener cualquier audio que esté reproduciéndose
      if (currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          currentUtterance = null;
      }

      // Limpiar todos los inputs y estados de reproducción
      Object.keys(userInputs).forEach(pronoun => {
          userInputs[pronoun] = '';
          checkedAnswers[pronoun] = null;
          isPlaying[pronoun] = false;
      });
  }

  function checkAnswer(pronoun) {
      if (!currentVerb.value || checkedAnswers[pronoun] !== null) return;

      const userInputTrimmed = userInputs[pronoun].trim().toLowerCase();
      const correctForm = conjugate(currentVerb.value, pronoun).toLowerCase();

      checkedAnswers[pronoun] = userInputTrimmed === correctForm;
  }

  function getPronounSpanish(pronoun) {
      const translations = {
          'Я': 'Yo',
          'Ты': 'Tú',
          'Он/Она': 'Él/Ella',
          'Мы': 'Nosotros',
          'Вы': 'Usted/Ustedes',
          'Они': 'Ellos/Ellas'
      };
      return translations[pronoun] || '';
  }

  function playPronunciation(pronoun) {
      if (!currentVerb.value) return;

      // Verificar que la API esté disponible
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          console.warn('Speech Synthesis API no está disponible en este navegador');
          return;
      }

      const speechSynthesis = window.speechSynthesis;

      // Detener cualquier audio que esté reproduciéndose
      if (currentUtterance) {
          speechSynthesis.cancel();
      }

      // Obtener la conjugación correcta
      const conjugation = conjugate(currentVerb.value, pronoun);
      const fullText = `${pronoun} ${conjugation}`;

      // Crear el utterance con configuración para ruso
      currentUtterance = new SpeechSynthesisUtterance(fullText);
      currentUtterance.lang = 'ru-RU'; // Idioma ruso
      currentUtterance.rate = 0.8; // Velocidad un poco más lenta para mejor comprensión
      currentUtterance.pitch = 1;
      currentUtterance.volume = 1;

      // Marcar como reproduciendo
      isPlaying[pronoun] = true;

      // Eventos para limpiar el estado
      currentUtterance.onend = () => {
          isPlaying[pronoun] = false;
          currentUtterance = null;
      };

      currentUtterance.onerror = () => {
          isPlaying[pronoun] = false;
          currentUtterance = null;
      };

      // Reproducir
      speechSynthesis.speak(currentUtterance);
  }

  // Función para convertir transliteración a pronunciación en español
  function transliterationToSpanish(transliterated) {
      let result = transliterated.toLowerCase();

      // Reemplazos específicos para sonidos rusos en español
      // Orden importante: primero los más largos
      result = result
          .replace(/shch/g, 'shch')
          .replace(/yo/g, 'ió')
          .replace(/yu/g, 'iu')
          .replace(/ya/g, 'ia')
          .replace(/ye/g, 'e')
          .replace(/zh/g, 'zh')
          .replace(/ch/g, 'ch')
          .replace(/sh/g, 'sh')
          .replace(/ts/g, 'ts')
          .replace(/kh/g, 'j')
          .replace(/y([^aeiou])/g, 'i$1') // 'y' antes de consonante = 'i'
          .replace(/y$/g, 'i') // 'y' al final = 'i'
          .replace(/ь/g, '') // Eliminar signo suave
          .replace(/'/g, ''); // Eliminar apóstrofes de transliteración

      // Aplicar reducción vocálica rusa: 'o' no acentuada se pronuncia como 'a'
      // Esto es una simplificación, pero ayuda con palabras como "говорить"
      const words = result.split(' ');
      result = words.map(word => {
          // Si la palabra tiene más de 2 sílabas, las 'o' no acentuadas pueden sonar como 'a'
          // Simplificación: cambiar 'o' por 'a' en posiciones no finales (excepto si está acentuada)
          if (word.length > 3 && word.includes('o')) {
              // Mantener 'o' al final y en posiciones específicas
              return word.replace(/o(?![aeiou]*$)/g, 'a');
          }
          return word;
      }).join(' ');

      return result;
  }

  // Función para obtener la pronunciación en español
  function getPronunciationSpanish(pronoun, conjugation) {
      if (!pronoun || !conjugation) return '';

      // Transliterar el texto ruso
      const fullText = `${pronoun} ${conjugation}`;
      let transliterated = transliterate(fullText, { unknown: '?' });

      // Convertir a pronunciación en español
      let pronunciation = transliterationToSpanish(transliterated);

      // Aplicar reglas de acentuación básicas
      // Para verbos, el acento suele estar en la raíz o en la terminación según el tipo
      const words = pronunciation.split(' ');
      const result = words.map((word, wordIndex) => {
          if (word.length <= 2) return word;

          // Si es el pronombre, mantenerlo simple
          if (wordIndex === 0) return word;

          // Para el verbo, intentar detectar el acento
          // Regla básica: si termina en consonante, acentuar la penúltima sílaba
          const vowels = word.match(/[aeiou]/gi);
          if (vowels && vowels.length > 1) {
              // Buscar la penúltima vocal
              let vowelPositions = [];
              for (let i = 0; i < word.length; i++) {
                  if (/[aeiou]/i.test(word[i])) {
                      vowelPositions.push(i);
                  }
              }

              if (vowelPositions.length >= 2) {
                  // Acentuar la penúltima vocal
                  const accentPos = vowelPositions[vowelPositions.length - 2];
                  const char = word[accentPos];
                  const accented = char === 'a' ? 'á' :
                                 char === 'e' ? 'é' :
                                 char === 'i' ? 'í' :
                                 char === 'o' ? 'ó' :
                                 char === 'u' ? 'ú' : char;

                  return word.substring(0, accentPos) + accented + word.substring(accentPos + 1);
              }
          }

          return word;
      }).join(' ');

      return result;
  }

  </script>

  <style>
  /* Estilos globales y de Tailwind (simulados en un entorno Vue SFC) */
  /* En un proyecto real de Vue/Vite, estos estilos irían en index.css o main.js */

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  body {
      font-family: 'Inter', sans-serif;
      background-color: #f7f9fb;
      min-height: 100vh;
      padding: 1rem; /* p-4 */
  }
  .card {
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .btn-primary {
      background-color: #3b82f6; /* Blue 500 */
      transition: background-color 0.2s, transform 0.1s;
  }
  .btn-primary:hover:not([disabled]) {
      background-color: #2563eb; /* Blue 600 */
  }
  .btn-primary:active:not([disabled]) {
      transform: scale(0.98);
  }
  .btn-primary[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
  }
  .conjugation-input {
      border: 2px solid #e5e7eb;
      transition: border-color 0.2s;
  }
  .conjugation-input:focus {
      border-color: #3b82f6;
      outline: none;
  }
  </style>