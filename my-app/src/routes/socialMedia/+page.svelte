<script>
	import { supabase } from '$lib/supabase';
	import { session } from '$lib/store/session';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let posts = [];
	let title = '';
	let description = '';
	let error = null;

	// Fetch posts from the database
	async function fetchPosts() {
		const { data, error: fetchError } = await supabase.from('social_media').select('*');
		if (fetchError) {
			error = fetchError.message;
		} else {
			posts = data;
		}
	}

	// Add a new post
	async function addPost() {
		const currentSession = get(session);

		if (!currentSession || !currentSession.user) {
			goto('/profilePage'); // Redirect to profile page if not signed in
			return;
		}

		if (!title.trim() || !description.trim()) {
			alert('Title and description cannot be empty');
			return;
		}

		const { error: insertError } = await supabase
			.from('social_media')
			.insert([{ title, description }]);

		if (insertError) {
			error = insertError.message;
		} else {
			title = '';
			description = '';
			fetchPosts(); // Refresh posts after adding
		}
	}

	function goToPostPage(id) {
		goto(`/Post/${id}`);
	}

	// Fetch posts when the component is mounted
	fetchPosts();
</script>

<div class="w-full min-h-screen flex justify-center items-start bg-[#f3e8ff] py-10">
	<div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8">
		<h1 class="text-3xl font-bold text-[#262626] mb-8 text-left">Social Media Posts</h1>

		{#if error}
			<p class="text-red-500 mb-4">{error}</p>
		{:else if posts.length === 0}
			<p class="mb-4">No posts found.</p>
		{:else}
			<ul class="flex flex-col gap-6">
				{#each posts as post}
					<li
						class="border border-[#BD9CFF] p-6 rounded-xl flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer bg-[#faf7ff] hover:bg-[#f3e8ff]"
						on:click={() => goToPostPage(post.id)}
					>
						<h2 class="text-2xl font-bold text-[#7c3aed] mb-2">{post.title}</h2>
						<p class="text-[#262626] mb-2">{post.description}</p>
						<img
							src="https://picsum.photos/500/200?random={post.id}"
							alt="Post image"
							class="mt-2 h-[200px] w-full max-w-[400px] object-cover rounded-lg border"
						/>
						<p class="mt-2 text-sm text-[#262626] opacity-80">
							<strong>Created by:</strong>
							{post.creator}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
