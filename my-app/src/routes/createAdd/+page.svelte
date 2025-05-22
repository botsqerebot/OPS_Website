<script>
    import { supabase } from '$lib/supabase';
    import { writable } from 'svelte/store';
    import { session } from '$lib/store/session';
    import { get } from 'svelte/store';


    let navn = '';
    let beskrivelse = '';
    let pris = '';
    let error = null;
    let successMessage = null;

    async function createAd() {
        error = null;
        successMessage = null;

        const currentSession = get(session);

        // Check if the user is logged in
        if (!currentSession || !currentSession.user) {
            error = 'You must be logged in to create an ad.';
            return;
        }

        if (pris < 0) {
            error = 'You need a positive price';
            pris = '';
            return;
        }

        // Insert data into the "Anonnser" table
        const { error: insertError } = await supabase.from('Annonser').insert([
            {
                navn,
                beskrivelse,
                pris: parseInt(pris, 10),
                creator_id: currentSession.user.id // Set the creator_id to the logged-in user's ID
            }
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
    <div>
        <label for="pris">Pris:</label>
        <input id="pris" type="number" bind:value={pris} required>
    </div>
    <button type="submit">Create Ad</button>
</form>