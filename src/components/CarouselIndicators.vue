<template>
    <ul class="carousel-indicators">
        <li
            v-for="(slide, index) in slides"
            :key="index"
            :class="indicatorClasses(index)"
        >
            <button
                @click.prevent="advanceToSlide(index)"
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
                current_index: 0,
                pause: () => {},
                pause_on_control_interaction: false
            }
    })
    readonly controls!: CarouselControls<T>;

    @InjectReactive({
        from: "slides",
        default: () => new Array<T>()
    })
    readonly slides!: Array<T>[];

    advanceToSlide(index: number) {
        if (this.controls.pause_on_control_interaction) {
            this.controls.pause();
        }

        this.controls.advance_to_slide(index);
    }

    indicatorClasses(index: number): string | null {
        return index === this.controls.current_index ? "active" : null;
    }

    indicatorTitle(index: number): string {
        return "Advance to slide " + (index + 1);
    }
}
</script>