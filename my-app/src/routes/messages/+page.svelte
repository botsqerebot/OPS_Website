<script>
import { supabase } from '$lib/supabase';
import { session } from '$lib/store/session';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

//let receiverId = null;
let messageContent = '';
let conversations = [];
let messages = [];
let error = null;
let userMap = {}; // The users names and surnames

// For new conversation
let allUsers = [];
let userSearch = '';
let filteredUsers = [];


let receiverId = $page.url.searchParams.get('receiver_id');

// Fetch all users for new conversation
async function fetchAllUsers() {
    const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, fornavn, etternavn");
    if (!fetchError) {
        allUsers = data;
    }
}

/* // Filter users for search
$: filteredUsers = userSearch
    ? allUsers.filter(
        u =>
            (u.fornavn + ' ' + u.etternavn)
                .toLowerCase()
                .includes(userSearch.toLowerCase()) &&
            u.id !== $session?.user?.id &&
            !conversations.includes(u.id)
    )
    : []; */

async function fetchUserNames(userIds) {
    if (!userIds.length) return; // <-- fixed typo
    const {data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, fornavn, etternavn")
        .in("id", userIds);

    if (fetchError) {
        console.error("Error fetching user names:", fetchError.message);
    } else {
        data.forEach(user => {
        userMap = { ...userMap, [user.id]: user };
    });
    }
}

async function fetchConversations(userId) {
    const { data, error: fetchError } = await supabase
        .from('Messages')
        .select('receiver_id, sender_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    if (fetchError) {
        error = fetchError.message;
    } else {
        const uniqueUsers = new Set(
            data.map((msg) =>
                msg.sender_id === userId ? msg.receiver_id : msg.sender_id
            )
        );
        conversations = Array.from(uniqueUsers);
        await fetchUserNames(conversations);
    }
}

async function fetchMessages(userId) {
    if (!receiverId) return;

    const { data, error: fetchError } = await supabase
        .from('Messages')
        .select('*')
        .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
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
            sender_id: $session.user.id,
            receiver_id: receiverId,
            content: messageContent
        });

    if (insertError) {
        console.error('Error sending message:', insertError.message);
    } else {
        messageContent = '';
        fetchMessages($session.user.id);
    }
}

// Reactively handle session and data fetching
$: if ($session && $session.user) {
    fetchConversations($session.user.id);
    if (receiverId) fetchMessages($session.user.id);
} else if ($session !== null && (!$session || !$session.user)) {
    goto('/profilePage');
}

/* $: if (
    conversations.length > 0 &&
    (!receiverId || !conversations.includes(receiverId))
) {
    receiverId = conversations[0];
} */
/* $: if (
    conversations.length > 0 &&
    !receiverId
) {
    receiverId = conversations[0];
} */

$: if (
    receiverId &&
    $session?.user?.id !== receiverId &&
    !conversations.includes(receiverId)
) {
    conversations = [...conversations, receiverId];
    // If userMap doesn't have this user, find them in allUsers and add
    if (!userMap[receiverId]) {
        const found = allUsers.find(u => u.id === receiverId);
        if (found) {
            userMap = { ...userMap, [receiverId]: found };
        } else {
            // fallback: fetch from db if not in allUsers
            fetchUserNames([receiverId]);
        }
    }
}

$: if ($session && $session.user) {
    fetchConversations($session.user.id);
    fetchAllUsers();
    if (receiverId) fetchMessages($session.user.id);
}
</script>

<div class="flex">
    <!-- Conversations List -->
    <div class="w-1/4 border-r">
        <h2 class="text-lg font-bold">Conversations</h2>
        <!--
        <div class="mb-4">
            <input
                type="text"
                placeholder="Start new conversation..."
                bind:value={userSearch}
                class="w-full border rounded px-2 py-1"
            />
            {#if userSearch && filteredUsers.length > 0}
                <ul class="border rounded mt-1 bg-white text-black">
                    {#each filteredUsers as user}
                        <li>
                            <button
                                class="w-full text-left px-2 py-1 hover:bg-gray-200"
                                on:click={() => {
                                    receiverId = user.id;
                                    userSearch = '';
                                }}
                            >
                                {user.fornavn} {user.etternavn}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div> -->
        <ul>
            {#each conversations as userId}
                <li>
                    <button
                        class="block w-full text-left p-2 hover:bg-gray-100"
                        on:click={() => (receiverId = userId)}
                    >
                        {#if userMap[userId]}
                            {userMap[userId].fornavn} {userMap[userId].etternavn}
                        {:else}
                            ...
                        {/if}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Messages Section -->
    <div class="w-3/4 p-4">
        {#if receiverId && userMap[receiverId]}
            <h2 class="text-lg font-bold">
                Chat with User {userMap[receiverId].fornavn} {userMap[receiverId].etternavn}
            </h2>
            <div class="border p-4 h-64 overflow-y-scroll">
                {#each messages as message}
                    <div class="{message.sender_id === $session.user.id ? 'text-right' : 'text-left'}">
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