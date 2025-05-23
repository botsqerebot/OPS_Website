<script>
	import { supabase } from '$lib/supabase';
	import { session } from '$lib/store/session';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let posts = [];
	let title = '';
	let description = '';
	let error = null;
	let successMessage = null;

	// Add a new post
	async function addPost() {
		error = null;
		successMessage = null;
		const currentSession = get(session);

		if (!currentSession || !currentSession.user) {
			goto('/profilePage'); // Redirect to profile page if not signed in
			return;
		}

		if (!title.trim() || !description.trim()) {
			error = 'Title and description cannot be empty';
			return;
		}

		const creator = currentSession.user.email;

		const { error: insertError } = await supabase
			.from('social_media')
			.insert([{ title, description, creator }]);

		if (insertError) {
			error = insertError.message;
		} else {
			title = '';
			description = '';
			successMessage = 'Post created successfully!';
		}
	}
</script>

<div class="w-full min-h-screen flex justify-center items-start bg-[#f3e8ff] py-10">
	<div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8">
		<h1 class="text-3xl font-bold text-[#262626] mb-8 text-left">Lag et nytt innlegg</h1>

		{#if error}
			<p class="text-red-500 mb-4">{error}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-600 mb-4">{successMessage}</p>
		{/if}

		<form on:submit|preventDefault={addPost} class="space-y-6">
			<div>
				<label for="title" class="block text-lg font-semibold text-[#262626] mb-1">Tittel</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					required
					class="w-full px-4 py-2 border-2 border-[#BD9CFF] rounded-lg focus:outline-none focus:border-[#a87cff] bg-[#faf7ff] text-[#262626] text-lg"
				/>
			</div>
			<div>
				<label for="description" class="block text-lg font-semibold text-[#262626] mb-1"
					>Beskrivelse</label
				>
				<textarea
					id="description"
					bind:value={description}
					required
					rows="5"
					class="w-full px-4 py-2 border-2 border-[#BD9CFF] rounded-lg focus:outline-none focus:border-[#a87cff] bg-[#faf7ff] text-[#262626] text-lg resize-y"
				></textarea>
			</div>
			<button
				type="submit"
				class="w-full py-3 mt-4 bg-[#BD9CFF] hover:bg-[#a87cff] text-[#262626] font-bold rounded-xl text-lg shadow transition"
			>
				Opprett innlegg
			</button>
		</form>
	</div>
</div>
