<template>
    <div class="carousel" :class="carousel_state_classes">
        <slot>
            <div class="carousel-inner">
                <slot name="carousel-slides">
                    <carousel-slides>
                        <template slot-scope="{ slide, controls }">
                            <slot
                                name="carousel-slide"
                                :slide="slide"
                                :controls="controls"
                            ></slot>
                        </template>
                    </carousel-slides>
                </slot>
                <div class="controls-parent">
                    <slot name="skip-link">
                        <skip-link
                            v-if="configuration.control_skip_link_anchor"
                            :href="configuration.control_skip_link_anchor"
                        ></skip-link>
                    </slot>
                    <div class="controls-wrapper">
                        <slot name="controls-left">
                            <carousel-previous-button>
                                <slot name="controls-left-button-text"></slot>
                            </carousel-previous-button>
                        </slot>
                        <div class="controls">
                            <slot name="before-indicators">
                                <carousel-play-button></carousel-play-button>
                            </slot>
                            <slot name="indicators">
                                <carousel-indicators></carousel-indicators>
                            </slot>
                            <slot name="after-indicators"></slot>
                        </div>
                        <slot name="controls-right">
                            <carousel-next-button>
                                <slot name="controls-right-button-text"></slot>
                            </carousel-next-button>
                        </slot>
                    </div>
                </div>
            </div>
        </slot>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, ProvideReactive } from "vue-property-decorator";
import { interval, Subscription } from "rxjs";

import CarouselControls from "@/types/CarouselControls";
import CarouselOptions from "@/types/CarouselOptions";

import CarouselIndicators from "@/components/CarouselIndicators.vue";
import CarouselNextButton from "@/components/CarouselNextButton.vue";
import CarouselPlayButton from "@/components/CarouselPlayButton.vue";
import CarouselPreviousButton from "@/components/CarouselPreviousButton.vue";
import CarouselSlides from "@/components/CarouselSlides.vue";

const DEFAULT_SLIDE_INTERVAL: number = 5000;

const MINIMUM_SLIDE_INTERVAL: number = 250;

@Component({
    components: {
        CarouselIndicators,
        CarouselNextButton,
        CarouselPlayButton,
        CarouselPreviousButton,
        CarouselSlides
    }
})
export default class SimpleCarousel<T> extends Vue {
    @Prop({
        default: () =>
            <CarouselOptions<T>>{
                auto_slide: true,
                control_skip_link_anchor: "#main-content",
                pause_on_control_interaction: true,
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

        if (this.maximum_index === this.current_index) {
            classes.push("slide-end");
        }

        return classes;
    }

    @ProvideReactive()
    get controls(): CarouselControls<T> {
        return <CarouselControls<T>>{
            advance_to_slide: this.advanceToSlide,
            current_index: this.current_index,
            is_playing: null !== this.carousel_play,
            maximum_index: this.maximum_index,
            next: this.slideNext,
            options: this.configuration,
            pause: this.carouselPause,
            pause_on_control_interaction: this.pause_on_control_interaction,
            play: this.carouselPlay,
            previous: this.slidePrevious
        };
    }

    get maximum_index(): number {
        return this.configuration.slides.length - 1;
    }

    @ProvideReactive()
    get slides(): Array<T> {
        return this.configuration.slides ?? new Array<T>();
    }

    get pause_on_control_interaction(): boolean {
        return this.configuration.pause_on_control_interaction ?? true;
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

    carouselPlay(): void {
        this.carousel_play = interval(this.play_slide_interval).subscribe(
            () => {
                this.slideNext();
            }
        );
    }

    carouselPause() {
        this.carousel_play?.unsubscribe();
        this.carousel_play = null;
    }

    beforeDestroy() {
        this.carouselPause();
    }

    deactivated() {
        this.carouselPause();
    }

    mounted(): void {
        this.restartCarousel();
    }

    restartCarousel() {
        false !== this.configuration.auto_slide ? this.carouselPlay() : null;
    }

    slideNext(): void {
        this.advanceToSlide(this.current_index + 1);
    }

    slidePrevious(): void {
        this.advanceToSlide(this.current_index - 1);
    }
}
</script>