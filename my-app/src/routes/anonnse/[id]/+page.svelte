<script>
    import { supabase } from '$lib/supabase';
    import { session } from '$lib/store/session';
    import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let anonnse = null;
    let error = null;
    //let messageContent = '';

    // Get the ID from the URL
    const id = $page.params.id;

    // Fetch the specific anonnse
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
        }
    }

    function goToMessages() {
    const currentSession = get(session);

    if (!currentSession || !currentSession.user) {
        goto('/profilePage');
        return;
    }

    if (currentSession.user.id === anonnse.creator_id) {
        alert("You cannot message yourself.");
        return;
    }

    goto(`/messages?receiver_id=${anonnse.creator_id}`);
}
    
    /* async function sendMessage() {
        const currentSession = get(session);

        if (!currentSession || !currentSession.user) {
            goto('/profilePage');
            return;
        }

        const {error: insertError } = await supabase
            .from('messages')
            .insert({
                sender_id: currentSession.user.id,
                receiver_id: anonnse.creator_id,
                content: messageContent
            });
        
        if (insertError) {
            console.error('Error sending message:', insertError.message);
        } else {
            messageContent = '';
            alert('Message sent!');
        }
    } */

    function goToExplore() {
        goto('/anonnsePage');
    }

    fetchAnonnse();
</script>

{#if error}
    <p class="text-red-500">Error: {error}</p>
{:else if !anonnse}
    <p>Loading...</p>
{:else}
    <div>
        <!-- Breadcrumb navigation -->
         <div><button on:click={goToExplore}>/Explore</button><span>/{anonnse.navn}</span></div>


        <h1>{anonnse.navn}</h1>
        <p><strong>ID:</strong> {anonnse.id}</p>
        <p><strong>Created At:</strong> {anonnse.created_at}</p>
        <p><strong>Beskrivelse:</strong> {anonnse.beskrivelse}</p>

    <button
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        on:click={goToMessages}
    >
        Send Message
    </button>
    </div>
{/if}