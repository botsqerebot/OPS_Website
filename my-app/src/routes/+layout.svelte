<script>
	import '../app.css';
	import Comp1 from '$lib/Comp1.svelte';
	let name = 'Tord';

	let { children } = $props();
</script>

<Comp1 {$name}></Comp1>
top bar
<br />

{@render children()}
<main></main>

botomm bar
