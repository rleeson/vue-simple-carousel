<template>
    <div class="post-carousel">
        <div class="carousel-inner">
            <template v-for="(post, index) in display_posts">
                <slot
                    name="carousel-slide"
                    :carousel-slide="{
                        current_index: current_index,
                        post: post,
                        slide_count_index: index,
                    }"
                />
            </template>
            <div class="controls-parent">
                <a
                    class="skip-navigation"
                    :href="configuration.control_skip_link_anchor"
                    >Skip article carousel controls, go to main content</a
                >
                <div class="controls-wrapper">
                    <slot
                        name="controls-left"
                        :controls-left="{
                            advance_to_slide: advanceToSlide,
                            next: slideNext,
                            previous: slidePrevious,
                        }"
                    >
                        <button
                            @click="slidePrevious()"
                            class="slide-left"
                            title="Previous article"
                        >
                            <span class="screen-reader-text"
                                >Show previous article</span
                            >
                        </button>
                    </slot>
                    <div class="controls">
                        <slot
                            name="before-indicators"
                            :before-indicators="{
                                advance_to_slide: advanceToSlide,
                                next: slideNext,
                                previous: slidePrevious,
                            }"
                        >
                            <button
                                v-if="is_carousel_playing"
                                @click="carouselPause"
                                class="carousel-play-pause"
                                :class="play_control_classes"
                                aria-label="Click to pause"
                                title="Pause"
                            >
                                <span class="screen-reader-text"
                                    >Pause Carousel</span
                                >
                            </button>
                            <button
                                v-else
                                @click="carouselPlay"
                                class="carousel-play-pause"
                                :class="play_control_classes"
                                aria-label="Click to play"
                                title="Play"
                            >
                                <span class="screen-reader-text"
                                    >Play Carousel</span
                                >
                            </button>
                        </slot>
                        <ul class="carousel-indicators">
                            <li
                                v-for="(post, index) in display_posts"
                                @selectSlide="advanceToSlide(index)"
                                @slideNext="slideNext()"
                                @slidePrevious="slidePrevious()"
                                :key="index"
                                :current_index="current_index"
                                :post="post"
                                :slide_count_index="index"
                            ></li>
                        </ul>
                        <slot name="after-indicators"> </slot>
                    </div>
                    <slot
                        name="controls-right"
                        :controls-right="{
                            advance_to_slide: advanceToSlide,
                            next: slideNext,
                            previous: slidePrevious,
                        }"
                    >
                        <button
                            @click="slideNext()"
                            class="slide-right"
                            title="Next article"
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

import CarouselOptions from "@/configuration/CarouselOptions";

const DEFAULT_SLIDE_INTERVAL: number = 5000;

const MINIMUM_SLIDE_INTERVAL: number = 250;

@Component({ components: {} })
export default class SimpleCarousel extends Vue {
    @Prop({
        default: () =>
            <CarouselOptions>{
                auto_slide: true,
                control_skip_link_anchor: "#main-content",
                posts: new Array<any>(),
                slide_interval: DEFAULT_SLIDE_INTERVAL,
            },
    })
    configuration!: CarouselOptions;

    current_index: number = 0;

    carousel_play: Subscription | null = null;

    get display_posts(): Array<any> {
        return this.configuration.posts;
    }

    get is_carousel_playing(): boolean {
        return null !== this.carousel_play;
    }

    get maximum_index(): number {
        return this.configuration.posts.length - 1;
    }

    get play_control_classes(): Array<string> {
        return this.is_carousel_playing ? ["play"] : ["pause"];
    }

    get play_slide_interval(): number {
        return MINIMUM_SLIDE_INTERVAL > this.configuration.slide_interval
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

    mounted(): void {
        this.restartCarousel();
    }

    restartCarousel() {
        this.configuration.auto_slide ? this.carouselPlay() : null;
    }

    slideNext(): void {
        this.advanceToSlide(this.current_index + 1);
    }

    slidePrevious(): void {
        this.advanceToSlide(this.current_index - 1);
    }
}
</script>
