<template>
    <div class="carousel" :class="carousel_state_classes">
        <div class="carousel-inner">
            <!-- previous -->
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
            <!-- slides -->
            <div class="slides-container">
                <template v-for="(slide, index) in display_slides">
                    <slot
                        name="carousel-slide"
                        :slide="slideFrame(slide, index)"
                        :controls="controls"
                    />
                </template>
            </div>
            <!-- indicators -->
            <div class="controls-parent">
                <a
                    v-if="configuration.control_skip_link_anchor"
                    class="skip-navigation screen-reader-text"
                    :href="configuration.control_skip_link_anchor"
                    >Skip article carousel controls, go to main content</a
                >
                <div class="controls-wrapper">
                    <div class="controls">
                        <slot name="before-indicators" :controls="controls">
                            <button
                                v-if="is_carousel_playing"
                                @click.prevent="carouselPause"
                                aria-label="Click to pause"
                                class="carousel-play-pause"
                                title="Pause carousel"
                            >
                                <span>Pause</span>
                                <span class="screen-reader-text"
                                    >&nbsp;carousel</span
                                >
                            </button>
                            <button
                                v-else
                                @click.prevent="carouselPlay"
                                aria-label="Click to play"
                                class="carousel-play-pause"
                                title="Play carousel"
                            >
                                <span>Play</span>
                                <span class="screen-reader-text"
                                    >&nbsp;carousel</span
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
                                        <span class="indicator-label">
                                            <span class="screen-reader-text"
                                                >Advance to slide&nbsp;</span
                                            >
                                            <span class="slide-number">{{
                                                index + 1
                                            }}</span>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </slot>
                        <slot name="after-indicators" :controls="controls">
                        </slot>
                    </div>
                </div>
            </div>
            <!-- next -->
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
</template>

<script lang="ts">
import { interval, Subscription, using } from "rxjs";
import { Vue, Component, Prop } from "vue-property-decorator";

import CarouselControls from "@/types/CarouselControls";
import CarouselOptions from "@/types/CarouselOptions";
import CarouselSlide from "@/types/CarouselSlide";

const DEFAULT_SLIDE_INTERVAL: number = 5000;

const MINIMUM_SLIDE_INTERVAL: number = 250;

@Component
export default class SimpleCarousel<T> extends Vue {
    @Prop({
        default: () =>
            <CarouselOptions<T>>{
                auto_slide: true,
                control_skip_link_anchor: "#main-content",
                slides: new Array<T>(),
                slide_interval: DEFAULT_SLIDE_INTERVAL
            }
    })
    configuration!: CarouselOptions<T>;

    current_index: number = 0;

    carousel_play: Subscription | null = null;

    get carousel_state_classes(): Array<string> {
        let classes = new Array<string>();

        classes.push(this.carousel_play ? "playing" : "stopped");

        if (false !== this.configuration.auto_slide) {
            classes.push("auto-slide");
        }

        if (0 === this.current_index) {
            classes.push("slide-start");
        }

        if (this.configuration.slides.length - 1 === this.current_index) {
            classes.push("slide-end");
        }

        return classes;
    }

    get controls(): CarouselControls<T> {
        return <CarouselControls<T>>{
            advance_to_slide: this.advanceToSlide,
            current_index: this.current_index,
            next: this.slideNext,
            options: this.configuration,
            previous: this.slidePrevious
        };
    }

    get display_slides(): Array<T> {
        return this.configuration.slides;
    }

    get is_carousel_playing(): boolean {
        return null !== this.carousel_play;
    }

    get maximum_index(): number {
        return this.configuration.slides.length - 1;
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
        false !== this.configuration.auto_slide ? this.carouselPlay() : null;
    }

    slideFrame(slide: T, index: number): CarouselSlide<T> {
        return <CarouselSlide<T>>{
            current_index: this.current_index,
            content: slide,
            slide_index: index
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
