<script>
    import { supabase } from '$lib/supabase';
    import { Auth } from '@supabase/auth-ui-svelte';
    import { ThemeSupa } from '@supabase/auth-ui-shared';

    let name = '';
    let surname = '';
    let email = '';
    let password = '';
    let isRegistering = false; // Toggle between login and registration
    let user = null;

    // Listen for authentication state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            user = session.user;

            // Check if user metadata (name, surname) exists
            const { data, error } = await supabase
                .from('profiles')
                .select('name, surname')
                .eq('id', user.id)
                .single();

            if (!data && isRegistering) {
                // Insert name and surname into the database if not already present
                await supabase.from('profiles').insert({
                    id: user.id,
                    name,
                    surname,
                    email: user.email
                });
            } else if (data) {
                name = data.name;
                surname = data.surname;
            }

            // Print user details for testing
            console.log(`Name: ${name}, Surname: ${surname}, Email: ${user.email}`);
        }
    });

    async function register() {
        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.error('Registration error:', error.message);
        } else {
            console.log('Registration successful');
        }
    }

    async function login() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error.message);
        } else {
            console.log('Login successful');
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
        user = null;
        name = '';
        surname = '';
        email = '';
        password = '';
    }
</script>

<div class="flex flex-col items-center justify-center h-screen">
    {#if user}
        <h1>Welcome, {name} {surname}!</h1>
        <p>Email: {user.email}</p>
        <button
            class="px-4 py-2 mt-4 bg-red-500 text-white rounded"
            on:click={signOut}
        >
            Sign Out
        </button>
    {:else}
        {#if isRegistering}
            <div class="mb-4">
                <label for="name" class="block mb-2">Name:</label>
                <input
                    id="name"
                    type="text"
                    bind:value={name}
                    class="border p-2 rounded w-full"
                />
            </div>
            <div class="mb-4">
                <label for="surname" class="block mb-2">Surname:</label>
                <input
                    id="surname"
                    type="text"
                    bind:value={surname}
                    class="border p-2 rounded w-full"
                />
            </div>
            <div class="mb-4">
                <label for="email" class="block mb-2">Email:</label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    class="border p-2 rounded w-full"
                />
            </div>
            <div class="mb-4">
                <label for="password" class="block mb-2">Password:</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    class="border p-2 rounded w-full"
                />
            </div>
            <button
                class="px-4 py-2 bg-green-500 text-white rounded"
                on:click={register}
            >
                Register
            </button>
            <p class="mt-4">
                Already have an account? 
                <button class="text-blue-500 underline" on:click={() => isRegistering = false}>
                    Log In
                </button>
            </p>
        {:else}
            <div class="mb-4">
                <label for="email" class="block mb-2">Email:</label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    class="border p-2 rounded w-full"
                />
            </div>
            <div class="mb-4">
                <label for="password" class="block mb-2">Password:</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    class="border p-2 rounded w-full"
                />
            </div>
            <button
                class="px-4 py-2 bg-blue-500 text-white rounded"
                on:click={login}
            >
                Log In
            </button>
            <p class="mt-4">
                Don't have an account? 
                <button class="text-blue-500 underline" on:click={() => isRegistering = true}>
                    Register
                </button>
            </p>
        {/if}
    {/if}
</div>