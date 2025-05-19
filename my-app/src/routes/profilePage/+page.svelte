<script>
    import { supabase } from '$lib/supabase';
    import { session } from '$lib/store/session';
    import { get } from 'svelte/store';

    let user = null;
    let fornavn = '';
    let etternavn = '';
    let email = '';
    let password = '';
    let loginEmail = '';
    let loginPassword = '';
    let loginError = '';
    let isRegistering = false;
    let description = '';
    let newDescription = '';
    let isEditingDescription = false;

    // Listen for authentication state changes
    async function fetchUserData() {
        try {
            const currentSession = get(session);

            if (currentSession && currentSession.user) {
                user = currentSession.user;
                email = user.email;

                // Fetch user metadata
                const { data, error: metadataError } = await supabase
                    .from('profiles')
                    .select('fornavn, etternavn, description')
                    .eq('id', user.id)
                    .single();

                if (metadataError) {
                    console.error('Error fetching user metadata:', metadataError.message);
                } else if (data) {
                    fornavn = data.fornavn;
                    etternavn = data.etternavn;
                    description = data.description || '';
                } else {
                    console.warn('No metadata found for user:', user.id);
                }
            }
        } catch (error) {
            console.error('Unexpected error in fetchUserData:', error);
        }
    }

    async function updateDescription() {
        try {
            const {error} = await supabase
                .from('profiles')
                .update({description: newDescription})
                .eq('id', user.id);
            
                if (error) {
                    console.error('Error updating description', error.message);
                } else {
                    description = newDescription;
                    isEditingDescription = false;
                }
        } catch (error) {
            console.log('Unexpected error during description update: ', error)
        }
    }

    async function signIn() {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword
            });

            if (error) {
                loginError = error.message;
                console.error('Login error:', error.message);
            } else {
                user = data.user;
                loginError = '';
                fetchUserData(); // Fetch user data after login
            }
        } catch (error) {
            console.error('Unexpected error during login:', error);
        }
    }

    async function signUp() {
        try {
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
            const userId = signUpData.user?.id;
            if (userId) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        fornavn,
                        etternavn
                    });

                if (profileError) {
                    console.error('Error inserting profile data:', profileError.message);
                } else {
                    console.log('Profile data inserted successfully');
                }
            }
        } catch (error) {
            console.error('Unexpected error during sign-up:', error);
        }
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign-out error:', error.message);
        } else {
            user = null;
        }
    }

    fetchUserData();
</script>


{#if user}
    <div class="p-4">
        <h1 class="text-2xl font-bold">Profile</h1>
        <p><strong>First Name:</strong> {fornavn}</p>
        <p><strong>Last Name:</strong> {etternavn}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Description: </strong> {description || 'No description added yet'}</p>

        {#if isEditingDescription}
        <div class="mt-4">
            <textarea
                bind:value={newDescription}
                class="w-full border rounded px-2 py-1"
                placeholder="Enter your description"
            ></textarea>
            <button
                class="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                on:click={updateDescription}
            >
                Save
            </button>
            <button
                class="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
                on:click={() => isEditingDescription = false}
            >
                Cancel
            </button>
        </div>
    {:else}
        <button
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            on:click={() => {
                newDescription = description;
                isEditingDescription = true;
            }}
        >
            Edit Description
        </button>
        {/if}
        <button
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            on:click={signOut}
        >
            Sign Out
        </button>
    </div>
{:else}
    <div class="p-4">
        {#if isRegistering}
            <h1 class="text-2xl font-bold">Register</h1>
            <form on:submit|preventDefault={signUp}>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label for="fornavn" class="block text-sm font-medium">First Name</label>
                    <input
                        id="fornavn"
                        type="text"
                        bind:value={fornavn}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label for="etternavn" class="block text-sm font-medium">Last Name</label>
                    <input
                        id="etternavn"
                        type="text"
                        bind:value={etternavn}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    class="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                >
                    Register
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
            <h1 class="text-2xl font-bold">Log In</h1>
            <form on:submit|preventDefault={signIn}>
                <div class="mb-4">
                    <label for="loginEmail" class="block text-sm font-medium">Email</label>
                    <input
                        id="loginEmail"
                        type="email"
                        bind:value={loginEmail}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label for="loginPassword" class="block text-sm font-medium">Password</label>
                    <input
                        id="loginPassword"
                        type="password"
                        bind:value={loginPassword}
                        class="mt-1 block w-full border rounded px-2 py-1"
                        required
                    />
                </div>
                {#if loginError}
                    <p class="text-red-500 text-sm">{loginError}</p>
                {/if}
                <button
                    type="submit"
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
    </div>
{/if}