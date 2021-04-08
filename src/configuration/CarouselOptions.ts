export default interface CarouselOptions {
  [index: string]: Array<any> | boolean | number | string;

  auto_slide: boolean;
  control_skip_link_anchor: string;
  posts: Array<any>;
  slide_interval: number;
}
