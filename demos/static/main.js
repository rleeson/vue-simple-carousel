var app = new Vue({
  el: "#app",
  data() {
    return {
      demo_configuration: {
        slides: [
          {
            cms_classes: "",
            id: 1,
            title: "Long article title",
            subtitle:
              "More information about this article, a very long article.",
          },
          {
            cms_classes: "special-format",
            id: 2,
            title: "Medium article title",
            subtitle: "More information about this article, of medium length.",
          },
          {
            cms_classes: "short-format custom-class",
            id: 3,
            title: "Medium article title too",
            subtitle:
              "More information about this article, of medium length again.",
          },
        ],
      },
      slideClasses: (slide) => {
        var classes = [];

        if (slide.current_index === slide.slide_index) {
          classes.push("active");
        }

        if ("" !== slide.content.cms_classes) {
          classes.push(slide.content.cms_classes);
        }

        return classes;
      },
      slideNumber(controls, index) {
        var total_slides = controls.options.slides.length;
        var slide = index + 1;

        if (0 > index) {
          slide = total_slides;
        } else if (index > total_slides - 1) {
          slide = 1;
        }

        return slide;
      },
    };
  },
});
