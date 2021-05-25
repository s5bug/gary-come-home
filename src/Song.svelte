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
    style="width:600px;"
>
    <track kind="captions">
</audio>

{#each data.lyrics.verses as verse }
<section>
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
