<script>
	import '../app.css';
	import NavBar from '$lib/navBar.svelte';
	import Footer from '$lib/footer.svelte';

	//let { children } = $props();
</script>

<NavBar />

<!-- {@render children()} -->
<slot></slot>
<main></main>
<Footer />
