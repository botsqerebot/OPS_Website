<script>
    import { supabase } from '$lib/supabase';
    import { session } from '$lib/store/session';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';

    let posts = [];
    let title = '';
    let description = '';
    let error = null;

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

        const creator = currentSession.user.email;

        const { error: insertError } = await supabase
            .from('social_media')
            .insert([{ title, description, creator}]);

        if (insertError) {
            error = insertError.message;
        } else {
            title = '';
            description = '';
            //fetchPosts(); // Refresh posts after adding
        }
    }

    // Fetch posts when the component is mounted
    //fetchPosts();
</script>

<h1>Create social media posts</h1>

<div class="mt-8">
    <h2 class="text-2xl font-bold">Create a New Post</h2>
    <form on:submit|preventDefault={addPost} class="mt-4">
        <div class="mb-4">
            <label for="title" class="block text-sm font-medium">Title</label>
            <input
                id="title"
                type="text"
                bind:value={title}
                class="mt-1 block w-full border rounded px-2 py-1"
                required
            />
        </div>
        <div class="mb-4">
            <label for="description" class="block text-sm font-medium">Description</label>
            <textarea
                id="description"
                bind:value={description}
                class="mt-1 block w-full border rounded px-2 py-1"
                required
            ></textarea>
        </div>
        <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
        >
            Add Post
        </button>
    </form>
</div>