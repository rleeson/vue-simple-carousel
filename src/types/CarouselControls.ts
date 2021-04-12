import CarouselOptions from "@/types/CarouselOptions";

export default interface CarouselControls {
  [index: string]: number | Function | CarouselOptions;

  current_index: number;
  options: CarouselOptions;

  advance_to_slide: (index: number) => void;
  next: () => void;
  previous: () => void;
}
