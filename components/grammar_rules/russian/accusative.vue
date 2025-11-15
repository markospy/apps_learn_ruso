<template>
	<Teleport to="body">
		<!-- Modal de ayuda con caso acusativo -->
		<div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
			<div class="bg-white shadow-xl rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
				<div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
					<h3 class="font-bold text-gray-800 text-2xl">Винительный падеж (Caso Acusativo)</h3>
					<button
						@click="showModal = false"
						class="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="space-y-8 p-6">
					<section>
						<h4 class="mb-4 pb-2 border-gray-100 border-b font-bold text-gray-800 text-xl">1. Definición y Preguntas Clave</h4>
						<p class="mb-4 text-gray-700 text-base">
							El Acusativo es el caso del <strong>objeto directo</strong> y se utiliza para indicar la cosa o persona que recibe directamente la acción del verbo.
						</p>
						<div class="bg-yellow-50 p-4 border border-yellow-200 rounded-lg">
							<p class="mb-2 font-semibold text-red-600">Preguntas que Responde:</p>
							<ul class="space-y-1 ml-5 text-gray-700 list-disc">
								<li><strong>Кого?</strong> (<em>Kogó?</em> ¿A quién?) - Para sustantivos <strong>animados</strong> (personas, animales).</li>
								<li><strong>Что?</strong> (<em>Chto?</em> ¿Qué?) - Para sustantivos <strong>inanimados</strong> (cosas, conceptos).</li>
							</ul>
						</div>
					</section>

					<section>
						<h4 class="mb-4 pb-2 border-gray-100 border-b font-bold text-gray-800 text-xl">2. Usos Principales</h4>
						<ul class="space-y-4">
							<li class="bg-white shadow-sm p-3 border border-blue-600 rounded-lg">
								<p class="mb-1 font-semibold text-blue-600 text-lg">Objeto Directo:</p>
								<p class="text-gray-700">La persona o cosa que recibe la acción del verbo.</p>
								<p class="bg-gray-100 mt-2 p-2 rounded font-mono text-sm">
									Я читаю <strong>книгу</strong>. (Yo leo <strong>el libro</strong>.)
								</p>
							</li>
							<li class="bg-white shadow-sm p-3 border border-blue-600 rounded-lg">
								<p class="mb-1 font-semibold text-blue-600 text-lg">Dirección o Destino (con В/НА):</p>
								<p class="text-gray-700">Indica movimiento "hacia" un lugar.</p>
								<p class="bg-gray-100 mt-2 p-2 rounded font-mono text-sm">
									Мы едем <strong>в Москву́</strong>. (Nosotros vamos <strong>a Moscú</strong>.)<br>
									Она идёт <strong>на рабо́ту</strong>. (Ella va <strong>al trabajo</strong>.)
								</p>
							</li>
							<li class="bg-white shadow-sm p-3 border border-blue-600 rounded-lg">
								<p class="mb-1 font-semibold text-blue-600 text-lg">Tiempo (Duración/Momento):</p>
								<p class="text-gray-700">Indica cuánto dura la acción o en qué día ocurre.</p>
								<p class="bg-gray-100 mt-2 p-2 rounded font-mono text-sm">
									Он читал <strong>це́лую не́делю</strong>. (Él leyó <strong>toda una semana</strong>.)<br>
									В <strong>среду́</strong> у нас урок. (El <strong>miércoles</strong> tenemos clase.)
								</p>
							</li>
						</ul>
					</section>

					<section>
						<h4 class="mb-4 pb-2 border-gray-100 border-b font-bold text-gray-800 text-xl">3. Regla de Oro de Declinación</h4>
						<p class="bg-red-50 mb-4 p-3 border border-red-200 rounded-lg font-bold text-gray-700 text-base">
							La clave para el Acusativo es la <strong>ANIMACIÓN</strong> del sustantivo:
						</p>

						<div class="overflow-x-auto">
							<table class="border border-gray-300 w-full text-sm border-collapse">
								<thead>
									<tr>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Género</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Nominativo (Quién/Qué)</th>
										<th class="bg-green-700 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Acusativo INANIMADO (Qué)</th>
										<th class="bg-red-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Acusativo ANIMADO (A quién)</th>
									</tr>
								</thead>
								<tbody>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Masculino</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">стол (mesa) / врач (doctor)</td>
										<td class="bg-green-100 px-4 py-3 border border-gray-300 font-bold text-gray-800">стол <span class="text-green-700">(NO CAMBIA)</span></td>
										<td class="bg-red-100 px-4 py-3 border border-gray-300 font-bold text-gray-800">врач<strong>а́</strong> <span class="text-red-600">(IGUAL A GENITIVO)</span></td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Femenino</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">кни́га (libro)</td>
										<td colspan="2" class="bg-yellow-100 px-4 py-3 border border-gray-300 font-bold text-gray-800 text-center">кни́г<strong>у</strong> <span class="text-blue-600">(Siempre cambia a -у/-ю)</span></td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Neutro</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">окно́ (ventana)</td>
										<td colspan="2" class="bg-green-100 px-4 py-3 border border-gray-300 font-bold text-gray-800 text-center">окно́ <span class="text-green-700">(NO CAMBIA)</span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					<section>
						<h4 class="mb-4 pb-2 border-gray-100 border-b font-bold text-gray-800 text-xl">4. Terminaciones de Sustantivos y Adjetivos</h4>

						<!-- Tabla de Sustantivos -->
						<p class="mt-6 mb-3 font-semibold text-blue-600 text-lg">A. Sustantivos</p>
						<div class="overflow-x-auto">
							<table class="border border-gray-300 w-full text-sm border-collapse">
								<thead>
									<tr>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Género</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Terminación Nominativo</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Terminación Acusativo</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Ejemplo (Nominativo → Acusativo)</th>
									</tr>
								</thead>
								<tbody>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Femenino</td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">-а / -я</td>
										<td class="px-4 py-3 border border-gray-300 font-bold text-gray-800"><strong>-у / -ю</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">кни́га → кни́г<strong>у</strong>, не́деля → не́дел<strong>ю</strong></td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Masculino Animado</td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">Ø (consonante), -й, -ь</td>
										<td class="px-4 py-3 border border-gray-300 font-bold text-gray-800"><strong>-а / -я</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">студе́нт → студе́нт<strong>а</strong>, учи́тель → учи́тел<strong>я</strong></td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800">Masculino Inanimado / Neutro</td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">Ø, -й, -ь, -о, -е</td>
										<td class="px-4 py-3 border border-gray-300 font-bold text-gray-800"><strong>No Cambia</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">стол → стол, мо́ре → мо́ре</td>
									</tr>
								</tbody>
							</table>
						</div>

						<!-- Tabla de Adjetivos -->
						<p class="mt-6 mb-3 font-semibold text-blue-600 text-lg">B. Adjetivos</p>
						<div class="overflow-x-auto">
							<table class="border border-gray-300 w-full text-sm border-collapse">
								<thead>
									<tr>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Género</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Nominativo</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Acusativo Inanimado</th>
										<th class="bg-blue-600 px-4 py-3 border border-gray-300 font-semibold text-white text-left">Acusativo Animado</th>
									</tr>
								</thead>
								<tbody>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Masculino</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">-ый / -ой</td>
										<td class="bg-green-100 px-4 py-3 border border-gray-300 font-bold text-gray-800">-ый / -ой</td>
										<td class="bg-red-100 px-4 py-3 border border-gray-300 font-bold text-gray-800">-ого́</td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Femenino</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">-ая / -яя</td>
										<td colspan="2" class="bg-yellow-100 px-4 py-3 border border-gray-300 font-bold text-gray-800 text-center">-ую / -юю</td>
									</tr>
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 border border-gray-300 font-medium text-gray-800"><strong>Neutro</strong></td>
										<td class="px-4 py-3 border border-gray-300 text-gray-700">-ое / -ее</td>
										<td colspan="2" class="bg-green-100 px-4 py-3 border border-gray-300 font-bold text-gray-800 text-center">-ое / -ее</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					<div class="bg-gray-100 p-4 rounded-xl text-center">
						<p class="text-gray-600 text-sm italic">¡La práctica constante de la distinción Animado vs. Inanimado es la clave para dominar este caso!</p>
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

