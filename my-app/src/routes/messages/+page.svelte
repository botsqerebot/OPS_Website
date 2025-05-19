<script>
    import { supabase } from '$lib/supabase';
    import { session } from '$lib/store/session';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';

    let receiverId = null;
    let messageContent = '';
    let conversations = [];
    let messages = [];
    let error = null;

    const currentSession = get(session);

    if (!currentSession || !currentSession.user) {
        goto('/profilePage');
    }

    $: receiverId = $page.url.searchParams.get('receiver_id');


    async function fetchConversations() {
    const { data, error: fetchError } = await supabase
        .from('Messages')
        .select('receiver_id, sender_id')
        .or(`sender_id.eq.${currentSession.user.id},receiver_id.eq.${currentSession.user.id}`);
    if (fetchError) {
        error = fetchError.message;
    } else {
        const uniqueUsers = new Set(
            data.map((msg) =>
                msg.sender_id === currentSession.user.id ? msg.receiver_id : msg.sender_id
            )
        );
        conversations = Array.from(uniqueUsers);
    }
}


/* async function fetchMessages() {
    const { data, error: fetchError } = await supabase
        .from('Messages')
        .select('*')
        .or(`sender_id.eq.${currentSession.user.id},receiver_id.eq.${currentSession.user.id}`)
        .eq('receiver_id', receiverId)
        .order('created_at', { ascending: true });

    if (fetchError) {
        console.error('Error fetching messages:', fetchError.message);
        error = fetchError.message;
    } else {
        messages = data;
    }
} */

async function fetchMessages() {
    if (!receiverId) return;

    const { data, error: fetchError } = await supabase
        .from('Messages')
        .select('*')
        .or(
            `and(sender_id.eq.${currentSession.user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentSession.user.id})`
        )
        .order('created_at', { ascending: true });

    if (fetchError) {
        console.error('Error fetching messages:', fetchError.message);
        error = fetchError.message;
    } else {
        messages = data;
    }
}


    async function sendMessage() {
    const { error: insertError } = await supabase
        .from('Messages')
        .insert({
            sender_id: currentSession.user.id,
            receiver_id: receiverId,
            content: messageContent
        });

    if (insertError) {
        console.error('Error sending message:', insertError.message);
    } else {
        messageContent = '';
        fetchMessages();
    }
}

    $: fetchConversations();
    $: if (receiverId) fetchMessages();
</script>

<div class="flex">
    <!-- Conversations List -->
    <div class="w-1/4 border-r">
        <h2 class="text-lg font-bold">Conversations</h2>
        <ul>
            {#each conversations as userId}
                <li>
                    <button
                        class="block w-full text-left p-2 hover:bg-gray-100"
                        on:click={() => (receiverId = userId)}
                    >
                        User {userId}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Messages Section -->
    <div class="w-3/4 p-4">
        {#if receiverId}
            <h2 class="text-lg font-bold">Chat with User {receiverId}</h2>
            <div class="border p-4 h-64 overflow-y-scroll">
                {#each messages as message}
                    <div class="{message.sender_id === currentSession.user.id ? 'text-right' : 'text-left'}">
                        <p>{message.content}</p>
                    </div>
                {/each}
            </div>
            <textarea
                bind:value={messageContent}
                placeholder="Write your message..."
                class="w-full border rounded px-2 py-1 mt-2"
            ></textarea>
            <button
                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                on:click={sendMessage}
            >
                Send
            </button>
        {:else}
            <p>Select a conversation to start messaging.</p>
        {/if}
    </div>
</div>