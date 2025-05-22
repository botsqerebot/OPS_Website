<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { faHome, faArrowUp, faSignInAlt, faArrowDown, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { supabase } from '$lib/supabase';

	let showDropdown = false;
	let session = null;

       // Check session on mount
	   onMount(async () => {
        // Fetch the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        // Listen for session changes
        supabase.auth.onAuthStateChange((event, newSession) => {
            session = newSession;
        });
    });

	// Function to handle clicks outside the dropdown
	function handleClickOutside(event) {
		const dropdown = document.getElementById('dropdownMenu');
		if (dropdown && !dropdown.contains(event.target)) {
			showDropdown = false;
		}
	}

	// Add event listener only on the client side
	onMount(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>
<div class="flex flex-col">
<div class="w-full h-[66px] px-5 flex items-center justify-between bg-[#191118] text-white">
	<div id="navBarLogo" class="h-[50px] w-[50px] border-3 border-[#BD9CFF] rounded-2xl">
		<img src="/favicon.png" alt="Logo" />
	</div>
	<div id="navBarContents" class="flex items-center flex-row gap-6">
		<button
			class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer"
			on:click={() => goto('/anonnsePage')}
		>
			<FontAwesomeIcon icon={faHome} />
			<h1>Explore</h1>
		</button>
		<button class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer" 
		on:click={() => goto('/socialMedia')}><h1>Social media</h1></button>
		<div class="relative">
			<!-- Create Button -->
			<button
				class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer"
				on:click={() => {
					showDropdown = !showDropdown;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						showDropdown = !showDropdown;
					}
				}}
				aria-expanded={showDropdown}
			>
				<h1>Create</h1>
				{#if showDropdown}
					<FontAwesomeIcon icon={faArrowDown} />
				{:else}
					<FontAwesomeIcon icon={faArrowUp} />
				{/if}
			</button>

			<!-- Dropdown Menu -->
			{#if showDropdown}
				<div
					id="dropdownMenu"
					class="absolute mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg flex items-center flex-col"
				>
					<button
						class="px-4 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
						on:click={() => goto('/createAdd')}
					>
						Anonnse
					</button>
					<button
						class="px-4 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
						on:click={() => goto('/createPost')}
					>
						Post
					</button>
					<!-- <button
						class="px-4 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
						on:click={() => goto('/option3')}
					>
						Option 3
					</button> -->
				</div>
			{/if}
		</div>
		<button
			class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer flex justify-center items-center gap-2"
			on:click={() => goto('/messages')}
		>
		<FontAwesomeIcon icon={faEnvelope}/>
			<h1>Messages</h1>
		</button>
		<!-- <button
			class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer"
			on:click={() => goto('/loginPage')}
		>
			<FontAwesomeIcon icon={faSignInAlt} />
			<h1>Log in</h1>
		</button> -->
		{#if session}
            <button
                class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer"
                on:click={() => goto('/profilePage')}
            >
                Profile
            </button>
        {:else}
            <button
                class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer"
                on:click={() => goto('/profilePage')}
            >
                Log In
            </button>
        {/if}

	</div>
</div>
<div class="bg-[#BD9CFF] h-0.5 w-full"></div>
</div>