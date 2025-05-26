<script>
	import { supabase } from '$lib/supabase';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let post = null;
	let error = null;

	// Get the ID from the URL
	const id = $page.params.id;

	// Fetch the specific post
	async function fetchPost() {
		const { data, error: fetchError } = await supabase
			.from('social_media')
			.select('*')
			.eq('id', id)
			.single();
		if (fetchError) {
			error = fetchError.message;
		} else {
			post = data;
		}
	}

	fetchPost();

	function goToSocialMedia() {
		goto('/socialMedia');
	}
</script>

{#if error}
	<div class="w-full min-h-screen flex justify-center items-center bg-[#f3e8ff]">
		<div class="bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8 max-w-xl w-full">
			<p class="text-red-500">{error}</p>
		</div>
	</div>
{:else if !post}
	<div class="w-full min-h-screen flex justify-center items-center bg-[#f3e8ff]">
		<div class="bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8 max-w-xl w-full">
			<p>Loading...</p>
		</div>
	</div>
{:else}
	<div class="w-full min-h-screen flex justify-center items-start bg-[#f3e8ff] py-10">
		<div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#BD9CFF] p-8">
			<!-- Breadcrumb navigation -->
			<div class="mb-6 text-sm text-[#BD9CFF]">
				<button class="hover:underline" on:click={goToSocialMedia}>Social Media</button>
				<span class="mx-1">/</span>
				<span class="font-semibold">{post.title}</span>
			</div>
			<h1 class="text-3xl font-bold text-[#262626] mb-4">{post.title}</h1>
			<img
				src="https://picsum.photos/500/200?random={post.id}"
				alt="Post image"
				class="mb-6 h-[200px] w-full max-w-[400px] object-cover rounded-lg border mx-auto"
			/>
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-[#262626] mb-2 text-left">Beskrivelse</h2>
				<p class="text-[#262626] opacity-90 text-left whitespace-pre-line">{post.description}</p>
			</div>
			<div class="h-0.5 w-full bg-[#BD9CFF] my-4"></div>
			<div class="text-xs text-[#262626] opacity-60 mt-2 text-left flex flex-wrap gap-4">
				<span><strong>ID:</strong> {post.id}</span>
				<span><strong>Created At:</strong> {post.created_at}</span>
				<span><strong>Creator:</strong> {post.creator}</span>
			</div>
		</div>
	</div>
{/if}
