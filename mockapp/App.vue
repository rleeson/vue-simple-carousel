<template>
    <div class="mock-carousel">
        <SimpleCarousel :configuration="sample_configuration">
            <template slot="carousel-slide" slot-scope="{ slide }">
                <article class="slide" :class="slideClasses(slide)">
                    <h1>{{ slide.content.title }}</h1>
                    <p class="subtitle">{{ slide.content.subtitle }}</p>
                    <p>Current index: {{ slide.current_index }}</p>
                    <p>Slide index: {{ slide.slide_index }}</p>
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
                </button>
            </template>
        </SimpleCarousel>
    </div>
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
        SimpleCarousel,
    },
})
export default class App extends Vue {
    get sample_configuration(): CarouselOptions {
        return <CarouselOptions>{
            slides: [
                <MockSlide>{
                    cms_classes: "",
                    id: 1,
                    title: "Long article title",
                    subtitle:
                        "More information about this article, a very long article.",
                },
                <MockSlide>{
                    cms_classes: "special-format",
                    id: 2,
                    title: "Medium article title",
                    subtitle:
                        "More information about this article, of medium length.",
                },
                <MockSlide>{
                    cms_classes: "short-format custom-class",
                    id: 3,
                    title: "Medium article title too",
                    subtitle:
                        "More information about this article, of medium length again.",
                },
            ],
        };
    }

    slideNumber(controls: CarouselControls, index: number) {
        const total_slides: number = controls.options.slides.length;
        let slide: number = index + 1;

        if (0 > index) {
            slide = total_slides;
        } else if (index > total_slides - 1) {
            slide = 1;
        }

        return slide;
    }

    slideClasses(slide: CarouselSlide) {
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
