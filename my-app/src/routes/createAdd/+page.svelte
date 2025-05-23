<script>
	import { supabase } from '$lib/supabase';
	import { session } from '$lib/store/session';
	import { get } from 'svelte/store';

	let navn = '';
	let beskrivelse = '';
	let pris = '';
	let error = null;
	let successMessage = null;

	async function createAd() {
		error = null;
		successMessage = null;

		const currentSession = get(session);

		// Check if the user is logged in
		if (!currentSession || !currentSession.user) {
			error = 'You must be logged in to create an ad.';
			return;
		}

		if (pris < 0) {
			error = 'You need a positive price';
			pris = '';
			return;
		}

		// Insert data into the "Anonnser" table
		const { error: insertError } = await supabase.from('Annonser').insert([
			{
				navn,
				beskrivelse,
				pris: parseInt(pris, 10),
				creator_id: currentSession.user.id
			}
		]);

		if (insertError) {
			error = insertError.message;
		} else {
			successMessage = 'Ad created successfully!';
			navn = '';
			beskrivelse = '';
			pris = '';
		}
	}
</script>

<div class="w-full min-h-screen flex justify-center items-start bg-[#f3e8ff] py-10">
	<div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8">
		<h1 class="text-3xl font-bold text-[#262626] mb-8 text-left">Opprett en ny annonse</h1>

		{#if error}
			<p class="text-red-500 mb-4">{error}</p>
		{/if}

		{#if successMessage}
			<p class="text-green-600 mb-4">{successMessage}</p>
		{/if}

		<form on:submit|preventDefault={createAd} class="space-y-6">
			<div>
				<label for="navn" class="block text-lg font-semibold text-[#262626] mb-1">Tittel</label>
				<input
					id="navn"
					type="text"
					bind:value={navn}
					required
					class="w-full px-4 py-2 border-2 border-[#BD9CFF] rounded-lg focus:outline-none focus:border-[#a87cff] bg-[#faf7ff] text-[#262626] text-lg"
				/>
			</div>
			<div>
				<label for="beskrivelse" class="block text-lg font-semibold text-[#262626] mb-1"
					>Beskrivelse</label
				>
				<textarea
					id="beskrivelse"
					bind:value={beskrivelse}
					required
					rows="5"
					class="w-full px-4 py-2 border-2 border-[#BD9CFF] rounded-lg focus:outline-none focus:border-[#a87cff] bg-[#faf7ff] text-[#262626] text-lg resize-y"
				></textarea>
			</div>
			<div>
				<label for="pris" class="block text-lg font-semibold text-[#262626] mb-1">Pris (NOK)</label>
				<input
					id="pris"
					type="number"
					min="0"
					bind:value={pris}
					required
					class="w-full px-4 py-2 border-2 border-[#BD9CFF] rounded-lg focus:outline-none focus:border-[#a87cff] bg-[#faf7ff] text-[#262626] text-lg"
				/>
			</div>
			<button
				type="submit"
				class="w-full py-3 mt-4 bg-[#BD9CFF] hover:bg-[#a87cff] text-[#262626] font-bold rounded-xl text-lg shadow transition"
			>
				Opprett annonse
			</button>
		</form>
	</div>
</div>
