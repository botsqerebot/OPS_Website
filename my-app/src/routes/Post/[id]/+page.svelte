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
    <p class="text-red-500">Error: {error}</p>
{:else if !post}
    <p>Loading...</p>
{:else}
    <div>
        <!-- Breadcrumb navigation -->
        <div>
            <button on:click={goToSocialMedia}>/Social Media</button>
            <span>/{post.title}</span>
        </div>

        <h1>{post.title}</h1>
        <p><strong>ID:</strong> {post.id}</p>
        <p><strong>Created At:</strong> {post.created_at}</p>
        <p><strong>Description:</strong> {post.description}</p>
        <img src="https://picsum.photos/500/200?random={post.id}" alt="">
    </div>
{/if}