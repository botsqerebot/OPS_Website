<script>
	import { supabase } from '$lib/supabase';

	let data = [];
	let error = null;
	let newName = '';
	let newAge = '';

	// Fetch data from Supabase on page load
	async function fetchData() {
		const { data: tableData, error: fetchError } = await supabase.from('test').select('*');
		if (fetchError) {
			error = fetchError.message;
		} else {
			data = tableData;
		}
	}

	// Add new data
	async function addData() {
		if (!newName.trim() || !newAge) {
			alert('Name and age cannot be empty');
			return;
		}

		if (isNaN(newAge) || newAge <= 0) {
			alert('Age must be positive');
			return;
		}

		const age = parseInt(newAge); // Convert newAge to an integer
		if (isNaN(age) || age <= 0) {
			alert('Age must be a positive number');
			return;
		}

		const { error: insertError } = await supabase
			.from('test')
			.insert([{ navn: newName, age: parseInt(newAge) }]);
		if (insertError) {
			error = insertError.message;
		} else {
			newName = '';
			newAge = '';
			fetchData();
		}
	}

	// Call fetchData when the component is mounted
	fetchData();
</script>

<h1>Data from Supabase</h1>

{#if error}
	<p class="text-red-500">Error: {error}</p>
{:else if data.length === 0}
	<p>No data found.</p>
{:else}
	<ul>
		{#each data as row}
			<li>Navn: {row.navn}, Age: {row.age}</li>
		{/each}
	</ul>
{/if}

<!--Add form to data-->
<div>
	<input type="text" bind:value={newName} placeholder="Enter name" />
	<input type="number" bind:value={newAge} placeholder="Enter age" />
	<button on:click={addData}>Add</button>
</div>
