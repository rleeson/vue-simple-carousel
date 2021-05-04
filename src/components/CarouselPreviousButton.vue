<template>
    <button
        @click.prevent="controls.previous()"
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
}
</script>