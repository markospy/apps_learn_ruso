<template>
	<Teleport to="body">
		<!-- Modal de casos gramaticales -->
		<div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
			<div class="flex flex-col bg-white shadow-xl rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden">
				<!-- Encabezado y Selector de Casos (Fijo en la parte superior) -->
				<div class="top-0 z-10 sticky flex-shrink-0 bg-gray-800 shadow-lg p-4">
					<div class="flex justify-between items-center mb-4">
						<h3 class="font-extrabold text-yellow-400 text-3xl">Падежи (Los 6 Casos Rusos)</h3>
						<button
							@click="showModal = false"
							class="hover:bg-gray-700 p-2 rounded-full text-gray-300 hover:text-red-500 transition-colors"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<!-- Botones de Navegación de Casos -->
					<div class="flex flex-wrap justify-center gap-2">
						<button
							v-for="c in cases"
							:key="c.id"
							@click="activeCase = c.id"
							:class="[
								'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105',
								activeCase === c.id
									? 'bg-blue-600 text-white shadow-xl'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							]"
						>
							{{ c.name_es }} ({{ c.name_ru }})
						</button>
					</div>
				</div>

				<!-- Contenido del Caso Activo (Scrollable) -->
				<div class="flex-grow p-6 overflow-y-auto">
					<div v-for="c in cases" :key="c.id">
						<div v-if="activeCase === c.id" class="space-y-6">

							<!-- Título del Caso y Palabras Clave -->
							<div class="p-4 rounded-xl" :class="c.color">
								<h4 class="mb-2 font-bold text-2xl">{{ c.name_es }} ({{ c.name_ru }})</h4>
								<p class="font-medium text-lg">
									<span class="font-bold">Preguntas:</span> {{ c.questions }}
									<span class="mx-3">|</span>
									<span class="font-bold">Función Principal:</span> {{ c.function }}
								</p>
							</div>

							<!-- Usos Detallados -->
							<section>
								<h5 class="mb-3 pb-1 border-b font-bold text-gray-800 text-xl">Usos Comunes:</h5>
								<ul class="space-y-3 ml-5 text-gray-700 list-disc">
									<li v-for="(use, index) in c.uses" :key="index">
										<span class="font-semibold">{{ use.title }}:</span> {{ use.description }}
										<p class="bg-gray-100 mt-1 p-2 border border-gray-200 rounded font-mono text-sm italic">{{ use.example }}</p>
									</li>
								</ul>
							</section>

							<!-- Tabla de Terminaciones -->
							<section>
								<h5 class="mb-3 pb-1 border-b font-bold text-gray-800 text-xl">Terminaciones Comunes de Sustantivos (Singular):</h5>
								<div class="overflow-x-auto">
									<table class="border border-gray-300 w-full text-sm border-collapse">
										<thead>
											<tr>
												<th class="bg-gray-700 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Género</th>
												<th class="bg-gray-700 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Terminación Nominativo</th>
												<th class="bg-gray-700 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Terminación {{ c.name_es }}</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(term, gender) in c.terminations" :key="gender" class="hover:bg-gray-50">
												<td class="px-4 py-3 border border-gray-300 font-semibold text-gray-800">{{ gender }}</td>
												<td class="px-4 py-3 border border-gray-300 text-gray-700">{{ term.nom }}</td>
												<td class="px-4 py-3 border border-gray-300 font-bold text-red-600">{{ term.case }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>

						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
const showModal = ref(false)
const activeCase = ref('accusative') // Inicialmente en Acusativo

// Definición de los 6 casos gramaticales del ruso
const cases = [
	{
		id: 'nominative',
		name_es: 'Nominativo',
		name_ru: 'Именительный',
		questions: 'Кто? (Kto? ¿Quién?) / Что? (Chto? ¿Qué?)',
		function: 'Sujeto de la oración.',
		color: 'bg-green-100 text-green-900',
		uses: [
			{ title: 'Sujeto', description: 'El actor principal de la acción.', example: 'Это **стол**. (Esta es una mesa.)' },
			{ title: 'Predicado nominal', description: 'Parte de la oración que nombra o describe el sujeto.', example: 'Мой брат – **студент**. (Mi hermano es estudiante.)' }
		],
		terminations: {
			'Masculino': { nom: 'Ø (consonante)', case: 'Ø (Sin cambio)' },
			'Femenino': { nom: '-а / -я', case: '-а / -я (Sin cambio)' },
			'Neutro': { nom: '-о / -е', case: '-о / -е (Sin cambio)' }
		}
	},
	{
		id: 'genitive',
		name_es: 'Genitivo',
		name_ru: 'Родительный',
		questions: 'Кого? (Kogó? ¿De quién?) / Чего? (Chegó? ¿De qué?)',
		function: 'Posesión, ausencia, cantidad, negación.',
		color: 'bg-yellow-100 text-yellow-900',
		uses: [
			{ title: 'Posesión', description: 'Indica a quién pertenece algo (con la preposición **у**).', example: '**У** меня́ **нет** машины. (Yo **no tengo** coche.)' },
			{ title: 'Ausencia/Negación', description: 'Se usa con la negación **нет** (no hay).', example: 'В магазине **нет** хлеба. (En la tienda **no hay** pan.)' },
			{ title: 'Cantidad', description: 'Se usa después de números y palabras de cantidad (много, мало, несколько).', example: 'Пять **студентов**. (Cinco estudiantes.)' },
			{ title: 'Origen/Procedencia', description: 'Se usa después de la preposición **из** (de/desde).', example: 'Он из **Москвы́**. (Él es de Moscú.)' }
		],
		terminations: {
			'Masculino': { nom: 'Ø', case: '-а / -я' },
			'Femenino': { nom: '-а / -я', case: '-ы / -и' },
			'Neutro': { nom: '-о / -е', case: '-а / -я' }
		}
	},
	{
		id: 'dative',
		name_es: 'Dativo',
		name_ru: 'Дательный',
		questions: 'Кому́? (Komú? ¿A quién/Para quién?) / Чему́? (Chemú? ¿A qué/Para qué?)',
		function: 'Objeto indirecto, edad, dirección a persona.',
		color: 'bg-red-100 text-red-900',
		uses: [
			{ title: 'Objeto Indirecto', description: 'Indica a quién va dirigida la acción (dar, decir, enviar).', example: 'Я даю́ пода́рок **бра́ту**. (Yo le doy un regalo **a mi hermano**.)' },
			{ title: 'Edad', description: 'Se usa para decir la edad (Me es/son).', example: '**Мне** три́дцать лет. (**Tengo** treinta años.)' },
			{ title: 'Necesidad/Obligación', description: 'Se usa con verbos impersonales (Нужно/Надо: es necesario).', example: '**Ему́** ну́жно идти́. (**Él** necesita ir.)' }
		],
		terminations: {
			'Masculino': { nom: 'Ø', case: '-у / -ю' },
			'Femenino': { nom: '-а / -я', case: '-е' },
			'Neutro': { nom: '-о / -е', case: '-у / -ю' }
		}
	},
	{
		id: 'accusative',
		name_es: 'Acusativo',
		name_ru: 'Винительный',
		questions: 'Кого́? (Kogó? ¿A quién?) / Что? (Chto? ¿Qué?)',
		function: 'Objeto directo, dirección, duración del tiempo.',
		color: 'bg-blue-100 text-blue-900',
		uses: [
			{ title: 'Objeto Directo', description: 'La cosa o persona que recibe directamente la acción del verbo.', example: 'Я читаю **кни́гу**. (Yo leo **el libro**.)' },
			{ title: 'Dirección (Movimiento)', description: 'Se usa con las preposiciones **в** (a/hacia) y **на** (a/hacia, sobre).', example: 'Мы едем **в Москву́**. (Nosotros vamos **a Moscú**.)' },
			{ title: 'Duración del Tiempo', description: 'Indica cuánto dura la acción.', example: 'Он читал **це́лую не́делю**. (Él leyó **toda una semana**.)' }
		],
		terminations: {
			'Masculino Animado': { nom: 'Ø', case: '-а / -я' },
			'Masculino Inanimado': { nom: 'Ø', case: 'Sin cambio' },
			'Femenino': { nom: '-а / -я', case: '-у / -ю' },
			'Neutro': { nom: '-о / -е', case: 'Sin cambio' }
		}
	},
	{
		id: 'instrumental',
		name_es: 'Instrumental',
		name_ru: 'Творительный',
		questions: 'Кем? (Kem? ¿Con quién?) / Чем? (Chem? ¿Con qué?)',
		function: 'Herramienta, medio, acompañamiento, profesión.',
		color: 'bg-purple-100 text-purple-900',
		uses: [
			{ title: 'Instrumento/Medio', description: 'La herramienta con la que se realiza la acción (con la preposición **с**).', example: 'Я пишу́ **карандашо́м**. (Yo escribo **con un lápiz**.)' },
			{ title: 'Acompañamiento', description: 'Indica con quién se está haciendo algo (con la preposición **с**).', example: 'Я пью чай **с молоком**. (Yo tomo té **con leche**.)' },
			{ title: 'Profesión/Identidad', description: 'Se usa después de verbos como **быть** (ser, con un cambio de estado).', example: 'Он стал **врачо́м**. (Él se convirtió **en doctor**.)' }
		],
		terminations: {
			'Masculino': { nom: 'Ø', case: '-ом / -ем' },
			'Femenino': { nom: '-а / -я', case: '-ой / -ей' },
			'Neutro': { nom: '-о / -е', case: '-ом / -ем' }
		}
	},
	{
		id: 'prepositional',
		name_es: 'Preposicional',
		name_ru: 'Предложный',
		questions: 'О ком? (O kom? ¿Acerca de quién?) / О чём? (O chiom? ¿Acerca de qué?)',
		function: 'Tema de conversación, ubicación (estática).',
		color: 'bg-pink-100 text-pink-900',
		uses: [
			{ title: 'Ubicación (Dónde)', description: 'Indica la posición estática de un objeto (con preposiciones **в** (en) y **на** (en/sobre)).', example: 'Я живу́ **в Москве́**. (Yo vivo **en Moscú**.)' },
			{ title: 'Tema de Conversación', description: 'Indica el tema sobre el que se habla o piensa (con la preposición **о** (acerca de)).', example: 'Мы говори́м **о филь́ме**. (Nosotros hablamos **acerca de la película**.)' },
			{ title: 'Tiempo (Meses/Años)', description: 'Se usa para indicar el mes o año.', example: 'Это было **в** две ты́сячи двадца́том **году́**. (Fue **en** el año dos mil veinte.)' }
		],
		terminations: {
			'Masculino': { nom: 'Ø', case: '-е' },
			'Femenino': { nom: '-а / -я', case: '-е' },
			'Neutro': { nom: '-о / -е', case: '-е' }
		}
	}
]

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

