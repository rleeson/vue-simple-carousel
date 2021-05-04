<template>
    <button
        @click.prevent="previous"
        class="slide-left"
        title="Show previous slide"
    >
        <slot>
            <span class="screen-reader-text">Show previous slide</span>
        </slot>
    </button>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from "vue-property-decorator";
import CarouselControls from "@/types/CarouselControls";

@Component
export default class CarouselPreviousButton<T> extends Vue {
    @InjectReactive({
        from: "controls",
        default: () =>
            <CarouselControls<T>>{
                previous: () => {}
            }
    })
    readonly controls!: CarouselControls<T>;

    previous() {
        if (this.controls.pause_on_control_interaction) {
            this.controls.pause();
        }

        this.controls.previous();
    }
}
</script>