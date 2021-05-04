import { Component, Vue } from "vue-property-decorator";

@Component
export default class Empty extends Vue {
  render(h: Function) {
    return h();
  }
}
