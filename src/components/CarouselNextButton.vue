<template>
    <button
        @click.prevent="controls.next()"
        class="slide-right"
        title="Show next slide"
    >
        <slot>
            <span class="screen-reader-text">Show next slide</span>
        </slot>
    </button>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from "vue-property-decorator";
import CarouselControls from "@/types/CarouselControls";

@Component
export default class CarouselNextButton<T> extends Vue {
    @InjectReactive({
        from: "controls",
        default: () =>
            <CarouselControls<T>>{
                next: () => {}
            }
    })
    readonly controls!: CarouselControls<T>;
}
</script>