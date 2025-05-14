<script>
	import '../app.css';
	import NavBar from '$lib/navBar.svelte';
	import Footer from '$lib/footer.svelte';
	import { initializeSession } from '$lib/store/session';

	initializeSession();
</script>

<NavBar />

<!-- {@render children()} -->
<slot></slot>
<main></main>

<Footer />
