<script>
	import { supabase } from '$lib/supabase';
	import { session } from '$lib/store/session';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let anonnse = null;
	let error = null;
	let creator = null;

	const id = $page.params.id;

	function formatDate(dateString) {
		if (!dateString) return 'No date avalible';
		const date = new Date(dateString);
		return (
			date.toLocaleDateString('no-NO', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}) +
			' kl. ' +
			date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
		);
	}

	async function fetchAnonnse() {
		const { data, error: fetchError } = await supabase
			.from('Annonser')
			.select('*')
			.eq('id', id)
			.single();
		if (fetchError) {
			error = fetchError.message;
		} else {
			anonnse = data;
			fetchCreator(data.creator_id);
		}
	}

	async function fetchCreator(creatorID) {
		if (!creatorID) return;
		const { data, error: fetchError } = await supabase
			.from('profiles')
			.select('fornavn, etternavn')
			.eq('id', creatorID)
			.single();
		if (!fetchError && data) {
			creator = data;
		}
	}

	function goToAnonnsePage() {
		goto('/anonnsePage');
	}

	function goToMessages() {
		const currentSession = get(session);

		if (!currentSession || !currentSession.user) {
			goto('/profilePage');
			return;
		}

		if (currentSession.user.id === anonnse.creator_id) {
			alert('You cannot message yourself.');
			return;
		}

		goto(`/messages?receiver_id=${anonnse.creator_id}`);
	}

	fetchAnonnse();
</script>

{#if error}
	<p class="text-red-500 px-6">{error}</p>
{:else if !anonnse}
	<p class="px-6">Loading...</p>
{:else}
	<div class="w-full min-h-screen px-4 md:px-16 lg:px-32 xl:px-64 py-10 box-border">
		<!-- Breadcrumb navigation -->
		<div class="mb-6 text-sm text-[#BD9CFF]">
			<button class="hover:underline" on:click={goToAnonnsePage}>Anonnser</button>
			<span class="mx-1">/</span>
			<span class="font-semibold">{anonnse.navn}</span>
		</div>
		<!-- Ad Name -->
		<h1 class="text-3xl font-bold text-[#262626] mb-2 text-left">{anonnse.navn}</h1>

		<!-- Images (placeholder) -->
		<div
			class="w-full aspect-[16/9] bg-gray-400 flex items-center justify-center rounded-xl mb-8"
			style="min-height: 300px; max-height: 70vh;"
		>
			<span class="text-[#262626] text-2xl font-bold">Ingen bilde</span>
		</div>
		<div class="flex flex-row">
			<div>
				<!-- Pris -->
				<div>
					<h1>Pris</h1>
					<h1 class="text-bold text-2xl">{anonnse.pris} NOK</h1>
				</div>
				<!-- Description -->
				<div class="mb-2">
					<h2 class="text-lg font-semibold text-[##262626] mb-2 text-left">Beskrivelse</h2>
					<p class="text-[##262626] opacity-90 text-left whitespace-pre-line">
						{anonnse.beskrivelse}
					</p>
				</div>
				<!-- Seperating div -->
				<div class="h-0.5 w-full bg-black"></div>
				<!-- Meta info -->
				<div class="text-xs text-[##262626] opacity-60 mt-4 text-left">
					<span><strong>ID:</strong> {anonnse.id}</span>
					<span class="ml-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="inline w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="##262626"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/></svg
						>
						<span>Opprettet: {formatDate(anonnse.created_at)}</span>
					</span>
				</div>
			</div>
			<div>
				<!-- Creator Name -->
				<div class="text-[##262626] opacity-80 text-base mb-6 text-left">
					{#if creator}
						Opprettet av: <span class="font-semibold">{creator.fornavn} {creator.etternavn}</span>
						<button
							class="mt-2 px-4 py-2 bg-[#BD9CFF] text-[#262626] font-semibold rounded-lg hover:bg-[#a87cff] transition w-fit"
							on:click={goToMessages}
						>
							Send melding til selger
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
