<script>
	let name = 'Seb';
	let list = [1, 2, 3];
	import Comp1 from '$lib/Comp1.svelte';
</script>

hei fra about {name}

<p>hbiujsdsujd</p>

{#each list as ting}
	<p>{ting}</p>
{/each}
<Comp1 />
<Comp1 />
<Comp1 />
<Comp1 />
