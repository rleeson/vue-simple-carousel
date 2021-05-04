<template>
    <ul class="carousel-indicators">
        <li
            v-for="(slide, index) in slides"
            :key="index"
            :class="indicatorClasses(index)"
        >
            <button
                @click.prevent="controls.advance_to_slide(index)"
                :aria-label="indicatorTitle(index)"
                :title="indicatorTitle(index)"
            >
                <span class="indicator-label">
                    <span class="screen-reader-text"
                        >Advance to slide&nbsp;</span
                    >
                    <span class="slide-number">{{ index + 1 }}</span>
                </span>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from "vue-property-decorator";
import CarouselControls from "@/types/CarouselControls";

@Component
export default class CarouselIndicators<T> extends Vue {
    @InjectReactive({
        from: "controls",
        default: () =>
            <CarouselControls<T>>{
                advance_to_slide: (index: number) => {},
                current_index: 0
            }
    })
    readonly controls!: CarouselControls<T>;

    @InjectReactive({
        from: "slides",
        default: () => new Array<T>()
    })
    readonly slides!: Array<T>[];

    indicatorClasses(index: number): string | null {
        return index === this.controls.current_index ? "active" : null;
    }

    indicatorTitle(index: number): string {
        return "Advance to slide " + (index + 1);
    }
}
</script>