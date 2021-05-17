<script lang="ts">
import Background from "./Background.svelte";

</script>

<Background />

<main role="main">
	<h1>Gary Come Home</h1>
	<article>
		<p>
			Gary, now I know I was wrong<br>
			I messed up, and now you're gone<br>
			Gary, I'm sorry I neglected you<br>
			Oh, I never expected you to run away and leave me<br>
			Feeling this empty<br>
			Your meow right now would sound like music to me<br>
			Please come home, 'cause I miss you, Gary
		</p>
		<p>
			(Gary, come home)<br>
			Gary, come home<br>
			(Gary, come home)
		</p>
		<p>
			Gary, can't you see I was blind?<br>
			I'll do anything to change your mind<br>
			More than a pet, you're my best friend<br>
			Too cool to forget, come back 'cause we are family<br>
			And forgive me for making you wanna roam<br>
			And now my heart is beating like the saddest metronome<br>
			Somewhere I hope you're reading my latest three-word poem<br>
			"Gary, come home"
		</p>
		<p>
			(Gary, come home)<br>
			Gary, come home<br>
			(Gary, come home)<br>
			Gary, come home<br>
			(Gary, come home)<br>
			Gary, come home<br>
			(Gary, come home)
		</p>
		<p>
			Ah, Gary, come home<br>
			Gary, come home<br>
			Gary, won't you come home?
		</p>
	</article>
</main>

<footer>
	Gary's Song · Spongebob Squarepants ℗ 2005 Viacom International Inc.
</footer>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		background: rgba(0.5, 0.5, 0.5, 0.5);
		border-radius: 1em;
		max-height: calc(100% - 10em);

		display: flex;
		flex-direction: column;
	}

	footer {
		text-align: center;
		max-width: 240px;
		margin: 0.5em auto;
		background: rgba(0.5, 0.5, 0.5, 0.5);
		padding: 0.5em;
		border-radius: 0.5em;
	}

	article {
		overflow-y: auto;
		flex-grow: 1;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		margin: 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: 640px;
		}

		footer {
			max-width: 640px;
		}
	}
</style>