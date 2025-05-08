<script>
	import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';

    let anonnser = [];
    let error = null;

    // Fetch data from the "Anonnser" table
    async function fetchAnonnser() {
        const { data, error: fetchError } = await supabase.from('Annonser').select('*');
        if (fetchError) {
            error = fetchError.message;
        } else {
            anonnser = data;
        }
    }

    function goToAnonnsePage(id) {
        goto(`/anonnse/${id}`);
    }

    // Fetch data when the component is mounted
    fetchAnonnser();
</script>

<h1>Anonnser</h1>

{#if error}
    <p class="text-red-500">Error: {error}</p>
{:else if anonnser.length === 0}
    <p>No anonnser found.</p>
{:else}
    <ul>
        {#each anonnser as anonnse}
            <li>
                <button 
                class="block p-4 border rounded hover:bg-gray-100 w-full text-left"
                on:click={() => goToAnonnsePage(anonnse.id)}
            >
                <p><strong>ID:</strong> {anonnse.id}</p>
                <p><strong>Created At:</strong> {anonnse.created_at}</p>
                <p><strong>Navn:</strong> {anonnse.navn}</p>
                <p><strong>Beskrivelse:</strong> {anonnse.beskrivelse}</p>
            </button>
            </li>
        {/each}
    </ul>
{/if}