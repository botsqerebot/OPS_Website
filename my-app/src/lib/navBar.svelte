<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		faHome,
		faArrowUp,
		faSignInAlt,
		faArrowDown,
		faEnvelope
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { supabase } from '$lib/supabase';

	let showDropdown = false;
	let session = null;

	// Check session on mount
	onMount(async () => {
		// Fetch the current session
		const {
			data: { session: currentSession }
		} = await supabase.auth.getSession();
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
	<nav
		class="w-full h-[80px] px-2 md:px-5 flex items-center justify-between bg-[#191118] text-white"
	>
		<button
			id="navBarLogo"
			class="h-[70px] w-[120px] xs:w-[140px] sm:w-[160px] md:h-[80px] md:w-[200px] lg:w-[250px] flex justify-center items-center rounded-2xl cursor-pointer"
			on:click={() => goto('/')}
		>
			<img
				src="/logo_svart_liggende.png"
				alt="Logo"
				class="h-[50px] xs:h-[55px] sm:h-[60px] md:h-[75px] w-auto max-w-full"
			/>
		</button>
		<!-- Hamburger menu for mobile -->
		<div class="md:hidden flex items-center">
			<button on:click={() => (showDropdown = !showDropdown)} aria-label="Open menu">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
		<!-- Desktop menu -->
		<div id="navBarContents" class="hidden md:flex items-center flex-row gap-2 lg:gap-6">
			<button
				class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer text-base md:text-xl"
				on:click={() => goto('/anonnsePage')}
			>
				<FontAwesomeIcon icon={faHome} />
				<h1>Explore</h1>
			</button>
			<button
				class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer text-base md:text-xl"
				on:click={() => goto('/socialMedia')}
			>
				<h1>Social media</h1>
			</button>
			<div class="relative">
				<button
					class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer text-base md:text-xl"
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
				{#if showDropdown}
					<div
						id="dropdownMenu"
						class="absolute mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg flex items-center justify-center flex-col z-50 min-w-[120px]"
					>
						<button
							class="px-7 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
							on:click={() => {
								goto('/createAdd');
								showDropdown = false;
							}}
						>
							Ad
						</button>
						<button
							class="px-7 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
							on:click={() => {
								goto('/createPost');
								showDropdown = false;
							}}
						>
							Post
						</button>
					</div>
				{/if}
			</div>
			<button
				class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer flex justify-center items-center gap-2 text-base md:text-xl"
				on:click={() => goto('/messages')}
			>
				<h1>Messages</h1>
			</button>
			{#if session}
				<button
					class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer text-base md:text-xl"
					on:click={() => goto('/profilePage')}
				>
					Profile
				</button>
			{:else}
				<button
					class="h-[48px] md:h-[64px] px-3 md:px-6 py-2 border-2 border-[#BD9CFF] rounded-2xl cursor-pointer text-base md:text-xl"
					on:click={() => goto('/profilePage')}
				>
					Log In
				</button>
			{/if}
		</div>
	</nav>
	<!-- Mobile dropdown menu -->
	{#if showDropdown && typeof window !== 'undefined' && window.innerWidth < 768}
		<div class="md:hidden flex flex-col items-center bg-[#191118] w-full py-2 z-40">
			<button
				class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
				on:click={() => {
					goto('/anonnsePage');
					showDropdown = false;
				}}>Explore</button
			>
			<button
				class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
				on:click={() => {
					goto('/socialMedia');
					showDropdown = false;
				}}>Social media</button
			>
			<button
				class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
				on:click={() => {
					goto('/createAdd');
					showDropdown = false;
				}}>Anonnse</button
			>
			<button
				class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
				on:click={() => {
					goto('/createPost');
					showDropdown = false;
				}}>Post</button
			>
			<button
				class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
				on:click={() => {
					goto('/messages');
					showDropdown = false;
				}}>Messages</button
			>
			{#if session}
				<button
					class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
					on:click={() => {
						goto('/profilePage');
						showDropdown = false;
					}}>Profile</button
				>
			{:else}
				<button
					class="w-11/12 my-1 py-3 border-2 border-[#BD9CFF] rounded-2xl text-lg text-white"
					on:click={() => {
						goto('/profilePage');
						showDropdown = false;
					}}>Log In</button
				>
			{/if}
		</div>
	{/if}
	<div class="bg-[#BD9CFF] h-0.5 w-full"></div>
</div>
