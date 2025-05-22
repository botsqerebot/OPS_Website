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

    // Helper to truncate description
    function truncate(text, length = 30) {
        if (!text) return '';
        return text.length > length ? text.slice(0, length) + '...' : text;
    }
</script>

<div class="min-h-screen py-8 flex justify-center">
    <div class="w-full max-w-screen-2xl px-4">
        <h1 class="text-3xl font-bold mb-8 text-[#BD9CFF]">Anonnser</h1>

        {#if error}
            <p class="text-red-500">Error: {error}</p>
        {:else if anonnser.length === 0}
            <p class="text-[#BD9CFF]">No anonnser found.</p>
        {:else}
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {#each anonnser as anonnse}
                    <button
                        type="button"
                        class="cursor-pointer flex flex-col p-0 rounded-xl bg-[#191118] w-full mx-auto shadow-sm shadow-gray-800 hover:shadow-2xl transition-shadow duration-300"
                        style="width: 275px; aspect-ratio: 275 / 395; max-width: 100%;"
                        on:click={() => goToAnonnsePage(anonnse.id)}
                    >
                        <!-- Picture placeholder: 80% of 395px ≈ 316px -->
                        <div
                            class="w-full flex-shrink-0 bg-gray-400 rounded-t-xl flex items-center justify-center"
                            style="height: 80%;"
                        >
                            <div class="w-full h-full flex items-center justify-center">
                                <span class="text-[#191118] text-base font-bold">No Image</span>
                            </div>
                        </div>
                        <div
                            class="flex flex-col justify-between px-3 text-[#BD9CFF] flex-1"
                            style="height: 20%;"
                        >
                            <div class="mb-1">
                                <h2 class="text-lg text-left font-bold truncate">{anonnse.navn}</h2>
                            </div>
                            <p class="text-sm text-left opacity-80 mb-1">{truncate(anonnse.beskrivelse, 50)}</p>
                        </div>
                    </button>
                {/each}
            </ul>
        {/if}
    </div>
</div>