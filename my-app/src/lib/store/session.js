/* import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

export const session = writable(null);

// Initialize the session store
export async function initializeSession() {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    session.set(currentSession);

    // Listen for session changes
    supabase.auth.onAuthStateChange((event, newSession) => {
        session.set(newSession);
    });
} */

import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

export const session = writable(null);

// Initialize the session store
export async function initializeSession() {
    try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session.set(currentSession);

        // Listen for session changes
        supabase.auth.onAuthStateChange((event, newSession) => {
            session.set(newSession);
        });
    } catch (error) {
        console.error('Error initializing session:', error);
    }
}