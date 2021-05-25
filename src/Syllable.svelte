<script lang="ts">
    import type { Syllable as SyllableData } from './song/song';

    export let syllable: SyllableData;
    export let progress: number;
</script>

<span
    class:before={progress < syllable.begin}
    class:during={progress >= syllable.begin && progress <= syllable.end}
    class:after={progress > syllable.end}
>{syllable.content}</span>

<style>
    .before {
        color: white;
    }

    .during {
        color: pink;
    }

    .after {
        color: yellow;
    }
</style>
