<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { Scene } from './background/scene';

    let canvas: HTMLCanvasElement;
    let w: number;
    let h: number;

    onMount(async () => {
        let scene = await Scene.init(canvas);

        let frame = requestAnimationFrame(loop);

        function loop(t) {
            canvas.width = w;
            canvas.height = h;

            scene.draw(t, w, h);

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });
</script>

<div
    class="background-div"
    bind:clientWidth={w}
    bind:clientHeight={h}>
<canvas
    class="background-canvas"
    bind:this={canvas}>

</canvas>
</div>

<style>
    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    /* Firefox < 16 */
    @-moz-keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    /* Safari, Chrome and Opera > 12.1 */
    @-webkit-keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    /* Internet Explorer */
    @-ms-keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    
    .background-div {
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: -1;
        width: 100%;
        height: 100%;
    }

    .background-canvas {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        
        -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
           -moz-animation: fadein 2s; /* Firefox < 16 */
            -ms-animation: fadein 2s; /* Internet Explorer */
             -o-animation: fadein 2s; /* Opera < 12.1 */
                animation: fadein 2s;
    }
</style>
