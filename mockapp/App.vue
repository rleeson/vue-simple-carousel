<template>
    <section class="mock-carousel">
        <SimpleCarousel :configuration="sample_configuration">
            <template slot="carousel-slide" slot-scope="{ slide }">
                <article class="slide" :class="slideClasses(slide)">
                    <h1>{{ slide.content.title }}</h1>
                    <div class="meta">
                        <span>Slide number: {{ slide.slide_index + 1 }}</span>
                        <span>Current index: {{ slide.current_index }}</span>
                        <span>Slide index: {{ slide.slide_index }}</span>
                    </div>
                    <p class="subtitle">{{ slide.content.subtitle }}</p>
                </article>
            </template>
            <template slot="controls-left" slot-scope="{ controls }">
                <button
                    @click.prevent="
                        controls.advance_to_slide(controls.current_index - 1)
                    "
                    class="slide-left"
                    title="Show previous slide"
                >
                    <span class="screen-reader-text"
                        >Show previous slide (#{{
                            slideNumber(controls, controls.current_index - 1)
                        }})</span
                    >
                    <span>&larr;</span>
                </button>
            </template>
            <template slot="controls-right" slot-scope="{ controls }">
                <button
                    @click.prevent="
                        controls.advance_to_slide(controls.current_index + 1)
                    "
                    class="slide-right"
                    title="Show next slide"
                >
                    <span class="screen-reader-text"
                        >Show next slide (#{{
                            slideNumber(controls, controls.current_index + 1)
                        }})</span
                    >
                    <span>&rarr;</span>
                </button>
            </template>
        </SimpleCarousel>
    </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CarouselOptions from "@/types/CarouselOptions";
import CarouselSlide from "@/types/CarouselSlide";
import MockSlide from "./types/MockSlide";
import SimpleCarousel from "@/SimpleCarousel.vue";
import CarouselControls from "@/types/CarouselControls";

@Component({
    components: {
        SimpleCarousel
    }
})
export default class App extends Vue {
    get sample_configuration(): CarouselOptions<MockSlide> {
        return <CarouselOptions<MockSlide>>{
            slides: [
                <MockSlide>{
                    cms_classes: "",
                    id: 1,
                    title: "Long article title",
                    subtitle:
                        "More information about this article, a very long article."
                },
                <MockSlide>{
                    cms_classes: "special-format",
                    id: 2,
                    title: "Medium article title",
                    subtitle:
                        "More information about this article, of medium length."
                },
                <MockSlide>{
                    cms_classes: "short-format custom-class",
                    id: 3,
                    title: "Medium article title too",
                    subtitle:
                        "More information about this article, of medium length again."
                }
            ]
        };
    }

    slideNumber(controls: CarouselControls<MockSlide>, index: number) {
        const total_slides: number = controls.options.slides.length;
        let slide: number = index + 1;

        if (0 > index) {
            slide = total_slides;
        } else if (index > total_slides - 1) {
            slide = 1;
        }

        return slide;
    }

    slideClasses(slide: CarouselSlide<MockSlide>) {
        let classes: string[] = [];

        if (slide.current_index === slide.slide_index) {
            classes.push("active");
        }

        if ("" !== slide.content.cms_classes) {
            classes.push(slide.content.cms_classes);
        }

        return classes;
    }
}
</script>

<style lang="scss">
html,
body {
    background: #6f6f6f;
    font-size: 10px;
    margin: 0;
    padding: 0;
}
.screen-reader-text,
.skip-navigation {
    display: inline;
    text-indent: -99999px;
    position: absolute;
    height: 0;
}
.skip-navigation {
    &:focus {
        background: #a4a4a4;
        border: solid 0.2rem currentColor;
        color: #2b2b2b;
        display: block;
        font-size: 1.4rem;
        height: auto;
        position: fixed;
        padding: 0.6rem;
        text-indent: 0;
        top: 0;
        left: 0;
    }
}
.mock-carousel {
    background: #2b2b2b;
}
.carousel {
    margin: 0 1rem;
    padding: 1rem 0;
    position: relative;

    @media (min-width: 1200px) {
        margin: 0 auto;
        max-width: 1200px;
    }
}
.controls-parent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
.controls-wrapper {
    display: grid;
    grid-template-columns: minmax(4rem, 10%) 1fr minmax(4rem, 10%);

    .controls {
        display: grid;
        grid-template-columns: minmax(6rem, 10%) 1fr;
    }
}
.carousel-indicators {
    list-style: none;
    display: flex;
    flex-direction: row;
}
.slide {
    color: #a4a4a4;
    display: none;
    font-size: 1.6rem;
    margin: 3.6rem 2rem 7.2rem;

    &.active {
        display: block;
    }

    h1 {
        font-size: 2.8rem;
        margin: 0;
        padding: 0;
    }
    .meta {
        font-size: 1.4rem;
        margin: 0.5rem 0 0;

        span + span {
            margin: 0 0 0 1rem;
        }
    }
    .subtitle {
        margin: 1.5rem 0 0;
    }
}
</style>