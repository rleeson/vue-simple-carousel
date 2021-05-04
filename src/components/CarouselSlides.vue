<template>
    <div class="slides-wrapper">
        <slot name="before-slides"></slot>
        <template v-for="(slide, index) in slides">
            <slot :slide="slideFrame(slide, index)" :controls="controls" />
        </template>
        <slot name="after-slides"></slot>
    </div>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from "vue-property-decorator";
import CarouselControls from "@/types/CarouselControls";
import CarouselSlide from "@/types/CarouselSlide";

@Component
export default class CarouselSlides<T> extends Vue {
    @InjectReactive({
        from: "controls",
        default: () =>
            <CarouselControls<T>>{
                current_index: 0
            }
    })
    readonly controls!: CarouselControls<T>;

    @InjectReactive({
        from: "slides",
        default: () => new Array<T>()
    })
    readonly slides!: Array<T>[];

    slideFrame(slide: T, index: number): CarouselSlide<T> {
        return <CarouselSlide<T>>{
            current_index: this.controls.current_index,
            content: slide,
            slide_index: index
        };
    }
}
</script>