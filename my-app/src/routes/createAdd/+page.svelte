<script>
    import { supabase } from '$lib/supabase';

    let navn = '';
    let beskrivelse = '';
    let error = null;
    let successMessage = null;

    // Function to handle form submission
    async function createAd() {
        error = null;
        successMessage = null;

        // Insert data into the "Anonnser" table
        const { error: insertError } = await supabase.from('Annonser').insert([
            { navn, beskrivelse }
        ]);

        if (insertError) {
            error = insertError.message;
        } else {
            successMessage = 'Ad created successfully!';
            navn = '';
            beskrivelse = '';
        }
    }
</script>

<h1>Create a New Ad</h1>

{#if error}
    <p class="text-red-500">Error: {error}</p>
{/if}

{#if successMessage}
    <p class="text-green-500">{successMessage}</p>
{/if}

<form on:submit|preventDefault={createAd}>
    <div>
        <label for="navn">Navn:</label>
        <input id="navn" type="text" bind:value={navn} required />
    </div>
    <div>
        <label for="beskrivelse">Beskrivelse:</label>
        <textarea id="beskrivelse" bind:value={beskrivelse} required></textarea>
    </div>
    <button type="submit">Create Ad</button>
</form>