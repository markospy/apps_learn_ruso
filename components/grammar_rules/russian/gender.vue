<template>
	<Teleport to="body">
		<!-- Modal de ayuda con géneros de sustantivos -->
		<div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
		<div class="bg-white shadow-xl rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
			<div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
				<h3 class="font-bold text-gray-800 text-2xl">Género de Sustantivos</h3>
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
				<p class="mb-6 text-gray-700 text-sm">
					<strong>En la lengua rusa hay tres géneros de sustantivos. En la mayoría de los casos la terminación de palabra indica el género.</strong>
				</p>

				<div class="gap-4 grid md:grid-cols-3">
					<!-- Género Masculino -->
					<div class="bg-blue-50 p-4 border-2 border-blue-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg text-center">
							Мужской род (= он)<br>
							<span class="font-normal text-base">Masculino</span>
						</h4>
						<div class="mb-3">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Terminaciones:</p>
							<p class="font-bold text-gray-800">Ø, -ь</p>
						</div>
						<div class="bg-white mb-3 p-3 border border-blue-200 rounded">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Ejemplos:</p>
							<ul class="space-y-1 text-gray-700 text-sm">
								<li>• стол</li>
								<li>• студент</li>
								<li>• музей</li>
								<li>• словарь</li>
							</ul>
						</div>
						<div class="bg-red-50 p-3 border border-red-200 rounded">
							<p class="mb-2 font-semibold text-red-700 text-sm">Excepciones:</p>
							<ul class="space-y-1 text-red-600 text-sm">
								<li>• папа</li>
								<li>• дедушка</li>
								<li>• дядя</li>
								<li>• кофе</li>
							</ul>
						</div>
					</div>

					<!-- Género Femenino -->
					<div class="bg-pink-50 p-4 border-2 border-pink-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg text-center">
							Женский род (= она)<br>
							<span class="font-normal text-base">Femenino</span>
						</h4>
						<div class="mb-3">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Terminaciones:</p>
							<p class="font-bold text-gray-800">-а/-я, -ь</p>
						</div>
						<div class="bg-white mb-3 p-3 border border-pink-200 rounded">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Ejemplos:</p>
							<ul class="space-y-1 text-gray-700 text-sm">
								<li>• вода</li>
								<li>• страна</li>
								<li>• фамилия</li>
							</ul>
						</div>
						<div class="bg-red-50 p-3 border border-red-200 rounded">
							<p class="mb-2 font-semibold text-red-700 text-sm">Excepciones:</p>
							<ul class="space-y-1 text-red-600 text-sm">
								<li>• дверь</li>
								<li>• тетрадь</li>
							</ul>
						</div>
					</div>

					<!-- Género Neutro -->
					<div class="bg-green-50 p-4 border-2 border-green-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg text-center">
							Средний род (= оно)<br>
							<span class="font-normal text-base">Neutro</span>
						</h4>
						<div class="mb-3">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Terminaciones:</p>
							<p class="font-bold text-gray-800">-о/е</p>
						</div>
						<div class="bg-white mb-3 p-3 border border-green-200 rounded">
							<p class="mb-2 font-semibold text-gray-700 text-sm">Ejemplos:</p>
							<ul class="space-y-1 text-gray-700 text-sm">
								<li>• окно</li>
								<li>• море</li>
							</ul>
						</div>
						<div class="bg-red-50 p-3 border border-red-200 rounded">
							<p class="mb-2 font-semibold text-red-700 text-sm">Excepciones:</p>
							<ul class="space-y-1 text-red-600 text-sm">
								<li>• имя</li>
								<li>• время</li>
								<li>• такси</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="bg-yellow-50 mt-6 p-4 border border-yellow-200 rounded-lg">
					<p class="text-gray-700 text-sm">
						<strong>Nota:</strong> El símbolo "Ø" indica que el sustantivo termina en consonante sin terminación específica.
						Las excepciones son palabras que no siguen las reglas generales de terminación.
					</p>
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