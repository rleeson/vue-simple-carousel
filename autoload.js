// Import the Carousel component
import SimpleCarousel from "./src/SimpleCarousel.vue";

// Declare install function executed by Vue.use()
export function install(Vue) {
  // Singleton latch
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.component("SimpleCarousel", SimpleCarousel);
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