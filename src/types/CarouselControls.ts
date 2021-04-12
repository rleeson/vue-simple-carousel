import CarouselOptions from "@/types/CarouselOptions";

export default interface CarouselControls<T> {
  [index: string]: number | Function | CarouselOptions<T>;

  current_index: number;
  options: CarouselOptions<T>;

  advance_to_slide: (index: number) => void;
  next: () => void;
  previous: () => void;
}
