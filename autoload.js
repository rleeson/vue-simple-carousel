// Import the Carousel component
import CarouselIndicators from "./src/components/CarouselIndicators.vue";
import CarouselNextButton from "./src/components/CarouselNextButton.vue";
import CarouselPlayButton from "./src/components/CarouselPlayButton.vue";
import CarouselPreviousButton from "./src/components/CarouselPreviousButton.vue";
import CarouselSlides from "./src/components/CarouselSlides.vue";
import Empty from "./src/components/Empty.ts";
import SimpleCarousel from "./src/SimpleCarousel.vue";

// Declare install function executed by Vue.use()
export function install(Vue) {
  // Singleton latch
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.component("SimpleCarousel", SimpleCarousel);
  Vue.component("CarouselIndicators", CarouselIndicators);
  Vue.component("CarouselNextButton", CarouselNextButton);
  Vue.component("CarouselPlayButton", CarouselPlayButton);
  Vue.component("CarouselPreviousButton", CarouselPreviousButton);
  Vue.component("CarouselSlides", CarouselSlides);
  Vue.component("Empty", Empty);
}

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Auto-install when Vue is found (e.g. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Standard module (npm/webpack/etc.) export
export default SimpleCarousel;
export { default as CarouselIndicators } from "./src/components/CarouselIndicators.vue";
export { default as CarouselNextButton } from "./src/components/CarouselNextButton.vue";
export { default as CarouselPlayButton } from "./src/components/CarouselPlayButton.vue";
export { default as CarouselPreviousButton } from "./src/components/CarouselPreviousButton.vue";
export { default as CarouselSlides } from "./src/components/CarouselSlides.vue";
export { default as Empty } from "./src/components/Empty.ts";
