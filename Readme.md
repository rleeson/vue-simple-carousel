# Vue Simple Carousel

Vue 2.x compatible carousel, supports modern browsers (no IE support). The carousel is intended to rotate slides, infinitely wrapping from the first to last slide.

## Uses and Constraints

The component offers a default set of controls aimed towards accessibility,
while providing a variety of slots to customize the appearance and implementation.
There are no default CSS styles to override as carousels are implemented in many
different layouts. The only bundled dependencies are some Vue Typescript class support libraries and minor bits of RxJS.

The library uses Typescript and implements a main component SimpleCarousel<T>, where the
generic type T represents the data model for the slide. The carousel then uses a
configuration object CarouselOptions<T>, which is combined with control state data and
passed into each control slot as CarouselControls<T>.

While the component itself uses a custom Webpack configuration, an example app using the component is included in mockapp/ which uses the Vue CLI.

## Required Properties

- Slides (`slides: Array<T>`): set of objects of type T passed into the slide repeater and all control areas

Below is shown an example using a Vue SFC, where the T is defined as MockSlide:

```jsx
<template>
...
    <SimpleCarousel :configuration="sample_configuration" />
...
</template>
...
<script lang="ts">
...
    get sample_configuration(): CarouselOptions<MockSlide> {
        return <CarouselOptions<MockSlide>>{
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
...
</script>
```

## Defaults

The other optional configuration elements are as follows:

- Auto Slide (`auto_slide: boolean = true`): Set false to disable automatic slide rotation, otherwise rotation occurs
- Pause Rotation on Control Interaction (`pause_on_control_interaction = true`): When enabled, control (indicators, next, previous) interaction pauses rotation
- Skip Link Anchor (`control_skip_link_anchor: string = "#main-content"`): Anchor link placed before the controls for keyboard and screen reader access to skip the carousel controls to a defined anchor on the page. Set blank to remove the link.
- Slide Interval: (`slide_interval: number = 5000`): Time in milliseconds between slide rotations, internally, the component enforces a minimum of 250ms

# Examples

Explore the mockapp/ directory to see a basic example with sample slide data, a template to format and display the slide data, and some basic control override examples.

# NPM Commands

- `yarn build`: Production build
- `yarn development`: HMR development version of the library
- `vue serve`: Mock application
