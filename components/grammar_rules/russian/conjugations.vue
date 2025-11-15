<template>
		<!-- Modal de ayuda con tabla de conjugaciones -->
		<div v-if="showModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4" @click.self="showModal = false">
			<div class="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
				<div class="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
					<h3 class="font-bold text-gray-800 text-2xl">Tabla de Conjugaciones Rusas</h3>
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