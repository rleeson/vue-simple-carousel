<template>
    <button
        @click.prevent="toggleState()"
        :aria-label="'Click to ' + next_control_state"
        class="carousel-play-pause"
        :title="next_control_state + ' carousel'"
    >
        <slot>
            <span>{{ next_control_state }}</span>
            <span class="screen-reader-text">&nbsp;carousel</span>
        </slot>
    </button>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from "vue-property-decorator";
import CarouselControls from "@/types/CarouselControls";

@Component
export default class CarouselPlayButton<T> extends Vue {
    @InjectReactive({
        from: "controls",
        default: () =>
            <CarouselControls<T>>{
                next: () => {}
            }
    })
    readonly controls!: CarouselControls<T>;

    get next_control_state(): string {
        return this.controls.is_playing ? "Pause" : "Play";
    }

    toggleState(): void {
        this.controls.is_playing ? this.controls.pause() : this.controls.play();
    }
}
</script>