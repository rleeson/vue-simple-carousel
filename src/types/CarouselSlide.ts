export default interface CarouselSlide {
  [index: string]: number | any;

  current_index: number;
  content: any;
  slide_index: number;
}
