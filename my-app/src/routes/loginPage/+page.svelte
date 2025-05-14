<script>
    import { supabase } from '$lib/supabase';

    // Form fields
    let email = '';
    let password = '';
    let fornavn = '';
    let etternavn = '';
    let klasse = '';
    let rolle = 'elev'; // Default role
    let isRegistering = false; // Toggle between login and registration
    let user = null;

    // Listen for authentication state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            user = session.user;

            // Fetch user metadata
            const { data, error } = await supabase
                .from('profiles')
                .select('fornavn, etternavn, klasse, rolle')
                .eq('id', user.id)
                .single();

            if (data) {
                fornavn = data.fornavn;
                etternavn = data.etternavn;
                klasse = data.klasse;
                rolle = data.rolle;
            }
        }
    });

    // Sign up a new user
    async function signUpNewUser() {
        // Create a new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });

        if (signUpError) {
            console.error('Sign-up error:', signUpError.message);
            return;
        }

        console.log('Sign-up successful:', signUpData);

        // Insert user metadata into the profiles table
        const userId = signUpData.user?.id; // Get the user ID from the sign-up response
        if (userId) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    fornavn,
                    etternavn,
                    klasse,
                    rolle
                });

            if (profileError) {
                console.error('Error inserting profile data:', profileError.message);
            } else {
                console.log('Profile data inserted successfully');
            }
        }
    }

    // Log in an existing user
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
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Sign-out error:', error.message);
    } else {
        console.log('Sign-out successful');
        user = null;
        email = '';
        password = '';
        fornavn = '';
        etternavn = '';
        klasse = '';
        rolle = '';
    }
}
</script>

<div class="flex flex-col items-center justify-center h-screen">
    {#if user}
        <!-- User Profile -->
        <h1>Welcome, {fornavn} {etternavn}!</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Class:</strong> {klasse}</p>
        <p><strong>Role:</strong> {rolle}</p>
        <button
            class="px-4 py-2 mt-4 bg-red-500 text-white rounded"
            on:click={signOut}
        >
            Sign Out
        </button>
    {:else}
        {#if isRegistering}
            <!-- Registration Form -->
            <h1 class="text-3xl font-bold mb-4">Create a New Account</h1>
            <form class="flex flex-col space-y-4" on:submit|preventDefault={signUpNewUser}>
                <input
                    type="email"
                    placeholder="Email"
                    bind:value={email}
                    class="p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    class="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="First Name"
                    bind:value={fornavn}
                    class="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    bind:value={etternavn}
                    class="p-2 border border-gray-300 rounded"
                />
                <select
                    bind:value={klasse}
                    class="p-2 border border-gray-300 rounded"
                >
                    <option value="" disabled selected>Select Class</option>
                    <option value="1imstA">1imstA</option>
                    <option value="1imstB">1imstB</option>
                </select>
                <button
                    type="submit"
                    class="bg-blue-500 text-white p-2 rounded"
                >
                    Sign Up
                </button>
            </form>
            <p class="mt-4">
                Already have an account? 
                <button
                    class="text-blue-500 underline"
                    on:click={() => isRegistering = false}
                >
                    Log In
                </button>
            </p>
        {:else}
            <!-- Login Form -->
            <h1 class="text-3xl font-bold mb-4">Log In</h1>
            <form class="flex flex-col space-y-4" on:submit|preventDefault={login}>
                <input
                    type="email"
                    placeholder="Email"
                    bind:value={email}
                    class="p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    class="p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    class="bg-blue-500 text-white p-2 rounded"
                >
                    Log In
                </button>
            </form>
            <p class="mt-4">
                Don't have an account? 
                <button
                    class="text-blue-500 underline"
                    on:click={() => isRegistering = true}
                >
                    Register
                </button>
            </p>
        {/if}
    {/if}
</div>