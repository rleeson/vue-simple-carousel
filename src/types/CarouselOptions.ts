export default interface CarouselOptions<T> {
  [index: string]: Array<T> | boolean | number | string;

  auto_slide: boolean;
  control_skip_link_anchor: string;
  pause_on_control_interaction: boolean;
  slides: Array<T>;
  slide_interval: number;
}
