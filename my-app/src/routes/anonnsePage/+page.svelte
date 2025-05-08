<script>
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
                <p><strong>ID:</strong> {anonnse.id}</p>
                <p><strong>Created At:</strong> {anonnse.created_at}</p>
                <p><strong>Navn:</strong> {anonnse.navn}</p>
                <p><strong>Beskrivelse:</strong> {anonnse.beskrivelse}</p>
            </li>
        {/each}
    </ul>
{/if}