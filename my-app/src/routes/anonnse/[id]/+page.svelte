<script>
    import { supabase } from '$lib/supabase';
    import { page } from '$app/stores';

    let anonnse = null;
    let error = null;

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

    fetchAnonnse();
</script>

{#if error}
    <p class="text-red-500">Error: {error}</p>
{:else if !anonnse}
    <p>Loading...</p>
{:else}
    <div>
        <h1>{anonnse.navn}</h1>
        <p><strong>ID:</strong> {anonnse.id}</p>
        <p><strong>Created At:</strong> {anonnse.created_at}</p>
        <p><strong>Beskrivelse:</strong> {anonnse.beskrivelse}</p>
    </div>
{/if}