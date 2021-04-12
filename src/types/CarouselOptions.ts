export default interface CarouselOptions<T> {
  [index: string]: Array<T> | boolean | number | string;

  auto_slide: boolean;
  control_skip_link_anchor: string;
  slides: Array<T>;
  slide_interval: number;
}
