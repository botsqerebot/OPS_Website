<script>
	import { supabase } from '$lib/supabase';
	import { session } from '$lib/store/session';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

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
			.from('profiles')
			.select('id, fornavn, etternavn');
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
		const { data, error: fetchError } = await supabase
			.from('profiles')
			.select('id, fornavn, etternavn')
			.in('id', userIds);

		if (fetchError) {
			console.error('Error fetching user names:', fetchError.message);
		} else {
			data.forEach((user) => {
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
				data.map((msg) => (msg.sender_id === userId ? msg.receiver_id : msg.sender_id))
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
		const trimmed = messageContent.trim();
		if (trimmed.length < 2) {
			return; // Optionally show an error message here
		}
		const { error: insertError } = await supabase.from('Messages').insert({
			sender_id: $session.user.id,
			receiver_id: receiverId,
			content: trimmed
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

	$: if (receiverId && $session?.user?.id !== receiverId && !conversations.includes(receiverId)) {
		conversations = [...conversations, receiverId];
		// If userMap doesn't have this user, find them in allUsers and add
		if (!userMap[receiverId]) {
			const found = allUsers.find((u) => u.id === receiverId);
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

	let intervalId;

	// Periodically reload messages
	onMount(() => {
		intervalId = setInterval(() => {
			if ($session && $session.user && receiverId) {
				fetchMessages($session.user.id);
			}
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div class="w-full min-h-screen flex justify-center items-center bg-[#f3e8ff] py-0">
	<div
		class="w-full max-w-6xl h-[80vh] bg-white rounded-2xl shadow-2xl border-2 border-[#BD9CFF] flex overflow-hidden"
	>
		<!-- Conversations List -->
		<div class="w-1/3 min-w-[200px] border-r border-[#BD9CFF] bg-[#f8f5ff] p-6 flex flex-col">
			<h2 class="text-2xl font-bold text-[#7c3aed] mb-6">Samtaler</h2>
			<ul class="space-y-2 flex-1 overflow-y-auto">
				{#each conversations as userId}
					<li>
						<button
							class="block w-full text-left px-4 py-3 rounded-lg hover:bg-[#e9ddff] transition font-medium text-[#262626] {receiverId ===
							userId
								? 'bg-[#e9ddff] font-bold'
								: ''}"
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
		<div class="w-2/3 p-8 flex flex-col h-full">
			{#if receiverId && userMap[receiverId]}
				<h2 class="text-2xl font-bold text-[#7c3aed] mb-4">
					Chat med {userMap[receiverId].fornavn}
					{userMap[receiverId].etternavn}
				</h2>
				<div
					class="flex-1 border border-[#BD9CFF] rounded-xl p-6 mb-6 bg-[#faf7ff] overflow-y-auto"
					style="min-height:0;"
				>
					{#each messages as message}
						<div
							class="mb-3 flex {message.sender_id === $session.user.id
								? 'justify-end'
								: 'justify-start'}"
						>
							<div
								class="{message.sender_id === $session.user.id
									? 'bg-[#BD9CFF] text-[#262626]'
									: 'bg-gray-200 text-[#262626]'} px-5 py-3 rounded-2xl max-w-[70%] break-words shadow"
							>
								<p>{message.content}</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="flex gap-3">
					<textarea
						bind:value={messageContent}
						placeholder="Skriv en melding..."
						class="flex-1 border-2 border-[#BD9CFF] rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#a87cff] bg-white text-[#262626]"
						rows="2"
					></textarea>
					<button
						class="px-8 py-3 bg-[#BD9CFF] hover:bg-[#a87cff] text-[#262626] font-bold rounded-xl shadow transition"
						on:click={sendMessage}
					>
						Send
					</button>
				</div>
			{:else}
				<div class="flex items-center justify-center h-full text-[#7c3aed] text-lg font-semibold">
					Velg en samtale for å starte meldinger.
				</div>
			{/if}
		</div>
	</div>
</div>
