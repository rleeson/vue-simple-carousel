import CarouselOptions from "@/types/CarouselOptions";

export default interface CarouselControls<T> {
  [index: string]: boolean | number | Function | CarouselOptions<T>;

  current_index: number;
  is_playing: boolean;
  maximum_index: number;
  options: CarouselOptions<T>;

  advance_to_slide: (index: number) => void;
  next: () => void;
  pause: () => void;
  play: () => void;
  previous: () => void;
}
