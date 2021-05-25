<script lang="ts">
import Background from "./Background.svelte";
import Song from "./Song.svelte";

import type { Song as SongData } from './song/song';

let volume: number = 1.0;

export let data: SongData;
</script>

<Background />

<main role="main">
	<h1>{data.title}</h1>
	<Song volume={volume} data={data} />
</main>

<footer>
	{data.copyright}
</footer>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

		text-align: center;
	}

	footer {
		max-width: 240px;
		margin: 0.5em;
		padding: 0.5em;
		background: rgba(0.4, 0.4, 0.4, 0.4);
		border-radius: 0.5em;
	}

	h1 {
		color: #ffffff;
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