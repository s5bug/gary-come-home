<script lang="ts">
    import type { Song } from './song/song';
    import Line from "./Line.svelte";

    export let volume: number;
    export let data: Song;

    let progress: number = 0.0;
</script>

<audio
    controls
    src={data.audio}
    bind:currentTime={progress}
    style="width:100%;"
>
    <track kind="captions">
</audio>

{#each data.lyrics.verses as verse, verseNum }
<section
    class:evenVerse={verseNum % 2 === 0}
    class:oddVerse={verseNum % 2 === 1}
    class="verse"
>
    <p>
        {#each verse.lines as line, i }
        <Line line={line} progress={progress} />
        {#if i < (verse.lines.length - 1) }
            <br>
        {/if}
        {/each}
    </p>
</section>    
{/each}

<style>
    .verse {
        font-size: 1.4em;
        border-radius: 1em;
        margin: 1em auto;
        padding: 0.5em;
    }

    .verse > p {
        margin: 0;
    }

    .evenVerse {
        background: rgba(45, 150, 170, 0.7);
    }

    .oddVerse {
        background: rgba(15, 120, 150, 0.7);
    }
</style>
