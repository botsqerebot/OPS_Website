<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { faHome, faArrowUp, faSignInAlt, faArrowDown } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	let showDropdown = false;

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

<div class="w-full h-[66px] px-5 flex items-center justify-between bg-[#191919] text-white">
	<div id="navBarLogo" class="h-[50px] w-[50px] border-3 border-[#BD9CFF] rounded-2xl">
		<img src="/favicon.png" alt="Logo" />
	</div>
	<div id="navBarContents" class="flex items-center flex-row gap-6">
		<button
			class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2 cursor-pointer"
			on:click={() => goto('./')}
		>
			<FontAwesomeIcon icon={faHome} />
			<h1>Explore</h1>
		</button>
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
						on:click={() => goto('/option1')}
					>
						Option 1
					</button>
					<button
						class="px-4 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
						on:click={() => goto('/option2')}
					>
						Option 2
					</button>
					<button
						class="px-4 py-2 w-full hover:bg-gray-100 cursor-pointer rounded-md"
						on:click={() => goto('/option3')}
					>
						Option 3
					</button>
				</div>
			{/if}
		</div>
		<div class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl"><h1>Become a seller</h1></div>
		<div class="px-4 py-2 border-2 border-[#BD9CFF] rounded-2xl flex items-center gap-2">
			<FontAwesomeIcon icon={faSignInAlt} />
			<h1>Log in</h1>
		</div>
	</div>
</div>
