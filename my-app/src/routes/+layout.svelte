<script>
	import '../app.css';
	import Comp1 from '$lib/Comp1.svelte';
	import NavBar from '$lib/navBar.svelte';
	import Footer from '$lib/footer.svelte';
	let name = 'Tord';

	//let { children } = $props();
</script>

<NavBar />
<Comp1 {name}></Comp1>

<!-- {@render children()} -->
<slot></slot>
<main></main>
<Footer />
