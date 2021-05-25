<script lang="ts">
    import type { Line as LineData } from './song/song';
    import Syllable from "./Syllable.svelte";

    export let line: LineData;
    export let progress: number;
</script>

{#each line.words as word, i }
    {#each word.syllables as syllable }
        <Syllable syllable={syllable} progress={progress} />
    {/each}
    {#if i < (line.words.length - 1)}
    <span> </span>
    {/if}
{/each}
