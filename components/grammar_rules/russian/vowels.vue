<template>
	<Teleport to="body">
		<!-- Modal de ayuda con pronunciación de vocales -->
		<div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
		<div class="bg-white shadow-xl rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
			<div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
				<h3 class="font-bold text-gray-800 text-2xl">Pronunciación de Vocales E, Ё, Ю, Я, O</h3>
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
				<div class="gap-6 grid md:grid-cols-2">
					<!-- Sección 1: Al principio de palabra, después de vocal o ь -->
					<div class="bg-blue-50 p-4 border-2 border-blue-200 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Al principio de palabra, después de vocal o Ь
						</h4>
						<p class="mb-4 text-gray-600 text-sm italic">
							En estos casos, las vocales se pronuncian con sonido "й" (y) al inicio
						</p>
						<div class="space-y-3">
							<div class="bg-white p-3 border border-blue-100 rounded">
								<p class="mb-1 font-bold text-gray-800">Е [й + э]</p>
								<p class="mb-2 text-gray-600 text-sm">Se pronuncia como "ye"</p>
								<p class="text-gray-700"><strong>Ejemplos:</strong> ем, моет, лье</p>
							</div>
							<div class="bg-white p-3 border border-blue-100 rounded">
								<p class="mb-1 font-bold text-gray-800">Ё [й + о]</p>
								<p class="mb-2 text-gray-600 text-sm">Se pronuncia como "yó"</p>
								<p class="text-gray-700"><strong>Ejemplos:</strong> ёлка, даёт, пьёт</p>
							</div>
							<div class="bg-white p-3 border border-blue-100 rounded">
								<p class="mb-1 font-bold text-gray-800">Ю [й + у]</p>
								<p class="mb-2 text-gray-600 text-sm">Se pronuncia como "yu"</p>
								<p class="text-gray-700"><strong>Ejemplos:</strong> юг, мою, пью</p>
							</div>
							<div class="bg-white p-3 border border-blue-100 rounded">
								<p class="mb-1 font-bold text-gray-800">Я [й + а]</p>
								<p class="mb-2 text-gray-600 text-sm">Se pronuncia como "ya"</p>
								<p class="text-gray-700"><strong>Ejemplos:</strong> яблоко, моя, семья</p>
							</div>
						</div>
					</div>

					<!-- Sección 2: Después de consonante -->
					<div class="bg-green-50 p-4 border-2 border-green-200 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Después de consonante
						</h4>
						<p class="mb-4 text-gray-600 text-sm italic">
							En estos casos, la consonante se suaviza (palataliza) y la vocal se pronuncia sin el sonido "й"
						</p>
						<div class="space-y-3">
							<div class="bg-white p-3 border border-green-100 rounded">
								<p class="mb-1 font-bold text-gray-800">ме [м'э]</p>
								<p class="mb-2 text-gray-600 text-sm">"m" suave + "e"</p>
								<p class="text-gray-700"><strong>Ejemplo:</strong> место</p>
							</div>
							<div class="bg-white p-3 border border-green-100 rounded">
								<p class="mb-1 font-bold text-gray-800">мё [м'о]</p>
								<p class="mb-2 text-gray-600 text-sm">"m" suave + "o"</p>
								<p class="text-gray-700"><strong>Ejemplo:</strong> мёд</p>
							</div>
							<div class="bg-white p-3 border border-green-100 rounded">
								<p class="mb-1 font-bold text-gray-800">мю [м'у]</p>
								<p class="mb-2 text-gray-600 text-sm">"m" suave + "u"</p>
								<p class="text-gray-700"><strong>Ejemplo:</strong> мюсли</p>
							</div>
							<div class="bg-white p-3 border border-green-100 rounded">
								<p class="mb-1 font-bold text-gray-800">мя [м'а]</p>
								<p class="mb-2 text-gray-600 text-sm">"m" suave + "a"</p>
								<p class="text-gray-700"><strong>Ejemplo:</strong> мята</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Reglas adicionales -->
				<div class="space-y-4 mt-6">
					<!-- Regla de la letra E -->
					<div class="bg-yellow-50 p-4 border-2 border-yellow-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Regla especial de la letra Е
						</h4>
						<p class="mb-3 text-gray-700 text-sm">
							<strong>La letra Е tónica se pronuncia como [э], la letra Е átona se pronuncia como [и]:</strong>
						</p>
						<div class="gap-4 grid md:grid-cols-2">
							<div class="bg-white p-3 border border-yellow-200 rounded">
								<p class="mb-2 font-bold text-gray-800">é = [э]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplos:</strong> музей, студент</p>
							</div>
							<div class="bg-white p-3 border border-yellow-200 rounded">
								<p class="mb-2 font-bold text-gray-800">e = [и]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplos:</strong> телефон, сестра</p>
							</div>
						</div>
					</div>

					<!-- Regla de la letra Ё -->
					<div class="bg-orange-50 p-4 border-2 border-orange-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Regla especial de la letra Ё
						</h4>
						<p class="mb-2 text-gray-700 text-sm">
							<strong>Ё siempre под ударением!</strong> (Ё siempre está acentuada)
						</p>
						<p class="text-gray-700 text-sm">
							<strong>La letra Ё siempre es tónica</strong> - siempre lleva el acento en la palabra.
						</p>
					</div>

					<!-- Regla de la letra Я -->
					<div class="bg-purple-50 p-4 border-2 border-purple-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Regla especial de la letra Я al principio de palabra
						</h4>
						<p class="mb-3 text-gray-700 text-sm">
							<strong>Al principio de la palabra Я bajo el acento se lee como [йа], y sin el acento como [йи]:</strong>
						</p>
						<div class="gap-4 grid md:grid-cols-2">
							<div class="bg-white p-3 border border-purple-200 rounded">
								<p class="mb-2 font-bold text-gray-800">Я́ = [йа]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplo:</strong> яблоко</p>
							</div>
							<div class="bg-white p-3 border border-purple-200 rounded">
								<p class="mb-2 font-bold text-gray-800">Я = [йи]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplos:</strong> язык, Япония</p>
							</div>
						</div>
					</div>

					<!-- Regla de la letra О -->
					<div class="bg-cyan-50 p-4 border-2 border-cyan-300 rounded-lg">
						<h4 class="mb-3 font-bold text-gray-800 text-lg">
							Regla especial de la letra О
						</h4>
						<p class="mb-3 text-gray-700 text-sm">
							<strong>La letra О tónica se pronuncia como [о], la letra О átona se pronuncia como [а]:</strong>
						</p>
						<div class="gap-4 grid md:grid-cols-2">
							<div class="bg-white p-3 border border-cyan-200 rounded">
								<p class="mb-2 font-bold text-gray-800">ó = [о]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplos:</strong> стол, окнó</p>
							</div>
							<div class="bg-white p-3 border border-cyan-200 rounded">
								<p class="mb-2 font-bold text-gray-800">o = [а]</p>
								<p class="text-gray-700 text-sm"><strong>Ejemplos:</strong> вода, молокó</p>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-yellow-50 mt-6 p-4 border border-yellow-200 rounded-lg">
					<p class="text-gray-700 text-sm">
						<strong>Nota importante:</strong> El apóstrofe (') después de la consonante indica que la consonante es suave (palatalizada).
						Por ejemplo, [м'э] significa que la "м" se pronuncia de forma suave, como en español cuando dices "mi" con la lengua hacia el paladar.
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