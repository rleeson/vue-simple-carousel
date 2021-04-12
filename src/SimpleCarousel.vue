<template>
    <div class="post-carousel">
        <div class="carousel-inner">
            <template v-for="(slide, index) in display_slides">
                <slot name="carousel-slide" :slide="slideFrame(slide, index)" />
            </template>
            <div class="controls-parent">
                <a
                    class="skip-navigation"
                    :href="configuration.control_skip_link_anchor"
                    >Skip article carousel controls, go to main content</a
                >
                <div class="controls-wrapper">
                    <slot name="controls-left" :controls="controls">
                        <button
                            @click.prevent="slidePrevious()"
                            class="slide-left"
                            title="Show previous article"
                        >
                            <span class="screen-reader-text"
                                >Show previous article</span
                            >
                        </button>
                    </slot>
                    <div class="controls">
                        <slot name="before-indicators" :controls="controls">
                            <button
                                v-if="is_carousel_playing"
                                @click.prevent="carouselPause"
                                aria-label="Click to pause"
                                class="carousel-play-pause"
                                :class="play_control_classes"
                                title="Pause carousel"
                            >
                                <span class="screen-reader-text"
                                    >Pause carousel</span
                                >
                            </button>
                            <button
                                v-else
                                @click.prevent="carouselPlay"
                                aria-label="Click to play"
                                class="carousel-play-pause"
                                :class="play_control_classes"
                                title="Play carousel"
                            >
                                <span class="screen-reader-text"
                                    >Play carousel</span
                                >
                            </button>
                        </slot>
                        <slot name="indicators" :controls="controls">
                            <ul class="carousel-indicators">
                                <li
                                    v-for="(slide, index) in display_slides"
                                    :key="index"
                                    :class="indicatorClasses(index)"
                                >
                                    <button
                                        @click.prevent="advanceToSlide(index)"
                                        :aria-label="indicatorTitle(index)"
                                        :title="indicatorTitle(index)"
                                    >
                                        <span class="indicator-label">{{
                                            indicatorTitle(index)
                                        }}</span>
                                    </button>
                                </li>
                            </ul>
                        </slot>
                        <slot name="after-indicators" :controls="controls">
                        </slot>
                    </div>
                    <slot name="controls-right" :controls="controls">
                        <button
                            @click.prevent="slideNext()"
                            class="slide-right"
                            title="Show next article"
                        >
                            <span class="screen-reader-text"
                                >Show next article</span
                            >
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { interval, Subscription } from "rxjs";
import { Vue, Component, Prop } from "vue-property-decorator";

import CarouselControls from "@/types/CarouselControls";
import CarouselOptions from "@/types/CarouselOptions";
import CarouselSlide from "@/types/CarouselSlide";

const DEFAULT_SLIDE_INTERVAL: number = 5000;

const MINIMUM_SLIDE_INTERVAL: number = 250;

@Component({ components: {} })
export default class SimpleCarousel extends Vue {
    @Prop({
        default: () =>
            <CarouselOptions>{
                auto_slide: true,
                control_skip_link_anchor: "#main-content",
                slides: new Array<any>(),
                slide_interval: DEFAULT_SLIDE_INTERVAL,
            },
    })
    configuration!: CarouselOptions;

    current_index: number = 0;

    carousel_play: Subscription | null = null;

    get controls(): CarouselControls {
        return <CarouselControls>{
            advance_to_slide: this.advanceToSlide,
            current_index: this.current_index,
            next: this.slideNext,
            options: this.configuration,
            previous: this.slidePrevious,
        };
    }

    get display_slides(): Array<any> {
        return this.configuration.slides;
    }

    get is_carousel_playing(): boolean {
        return null !== this.carousel_play;
    }

    get maximum_index(): number {
        return this.configuration.slides.length - 1;
    }

    get play_control_classes(): Array<string> {
        return this.is_carousel_playing ? ["play"] : ["pause"];
    }

    get play_slide_interval(): number {
        return !this.configuration.slide_interval ||
            MINIMUM_SLIDE_INTERVAL > this.configuration.slide_interval
            ? DEFAULT_SLIDE_INTERVAL
            : this.configuration.slide_interval;
    }

    /**
     * Advance to the given slide, wrapping past the boundaries
     *  - When greater than configuration.maximum_posts, goes to the start
     *  - When less than the first slide, goes to the end
     *
     * @param next_index
     */
    advanceToSlide(next_index: number) {
        let bounded_index: number = next_index;
        if (0 > next_index) {
            bounded_index = this.maximum_index;
        } else if (this.maximum_index < next_index) {
            bounded_index = 0;
        }
        this.current_index = bounded_index;
    }

    carouselPause(): void {
        this.clearCarousel();
    }

    carouselPlay(): void {
        this.carousel_play = interval(this.play_slide_interval).subscribe(
            () => {
                this.slideNext();
            }
        );
    }

    clearCarousel() {
        this.carousel_play?.unsubscribe();
        this.carousel_play = null;
    }

    beforeDestroy() {
        this.clearCarousel();
    }

    deactivated() {
        this.clearCarousel();
    }

    indicatorClasses(index: number): string | null {
        return index === this.current_index ? "active" : null;
    }

    indicatorTitle(index: number): string {
        return "Advance to slide " + (index + 1);
    }

    mounted(): void {
        this.restartCarousel();
    }

    restartCarousel() {
        this.configuration.auto_slide ? this.carouselPlay() : null;
    }

    slideFrame(slide: any, index: number): CarouselSlide {
        return <CarouselSlide>{
            current_index: this.current_index,
            content: slide,
            slide_index: index,
        };
    }

    slideNext(): void {
        this.advanceToSlide(this.current_index + 1);
    }

    slidePrevious(): void {
        this.advanceToSlide(this.current_index - 1);
    }
}
</script>
