export default interface CarouselSlide<T> {
  [index: string]: number | T;

  current_index: number;
  content: T;
  slide_index: number;
}
