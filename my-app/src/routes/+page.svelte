<script>
	import { goto } from '$app/navigation';
</script>

<div class="my-10 flex flex-col items-center min-h-[70vh]">
	<ul class="px-5 w-full max-w-2xl">
		<li>
			<button
				class="h-[125px] md:h-40 w-full mb-7 rounded-2xl bg-white border-2 border-[#BD9CFF] shadow-lg hover:shadow-2xl transition-shadow duration-200 text-4xl md:text-5xl text-black flex flex-col justify-between py-5 px-6 text-right font-semibold hover:bg-[#f3e8ff] focus:outline-none"
				on:click={() => goto('/createAdd')}
			>
				<h1>Make an ad</h1>
				<div class="text-left text-lg md:text-2xl mt-2 text-gray-700 font-normal">
					<p>Make an ad to offer work you can do</p>
				</div>
			</button>
		</li>
		<li>
			<button
				class="h-[125px] md:h-40 w-full mb-7 rounded-2xl bg-white border-2 border-[#BD9CFF] shadow-lg hover:shadow-2xl transition-shadow duration-200 text-4xl md:text-5xl text-black flex flex-col justify-between py-5 px-6 text-right font-semibold hover:bg-[#f3e8ff] focus:outline-none"
				on:click={() => goto('/socialMedia')}
			>
				<h1>View posts</h1>
				<div class="text-left text-lg md:text-2xl mt-2 text-gray-700 font-normal">
					<p>View posts made by others getting in the job market</p>
				</div>
			</button>
		</li>
		<li>
			<button
				class="h-40 md:h-48 w-full mb-7 rounded-2xl bg-white border-2 border-[#BD9CFF] shadow-lg hover:shadow-2xl transition-shadow duration-200 text-4xl md:text-5xl text-black flex flex-col justify-between py-5 px-6 text-right font-semibold hover:bg-[#f3e8ff] focus:outline-none"
				on:click={() => goto('/about')}
			>
				<h1>About us</h1>
				<div class="text-left text-lg md:text-2xl mt-2 text-gray-700 font-normal">
					<p>
						We are an organization <br />made for making it easier for you <br />to get work and put
						yourself out in the job market
					</p>
				</div>
			</button>
		</li>
	</ul>
</div>
