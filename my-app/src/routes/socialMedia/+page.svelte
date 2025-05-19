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
            .insert([{ title, description}]);

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

<h1>Social Media Posts</h1>

{#if error}
    <p class="text-red-500">Error: {error}</p>
{:else if posts.length === 0}
    <p>No posts found.</p>
{:else}
    <ul class="flex flex-col">
        {#each posts as post}
        <button on:click={() => goToPostPage(post.id)}>
            <li class="border p-4 mb-4 rounded">
                <h2 class="text-xl font-bold">{post.title}</h2>
                <p>{post.description}</p>
                <img src="https://picsum.photos/500/200?random={post.id}" alt="Post image" class="mt-2" />
                <p><strong>Created by: </strong>{post.creator}</p>
            </li>
        </button>
        {/each}
    </ul>
{/if}
