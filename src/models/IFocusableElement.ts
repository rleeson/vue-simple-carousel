export default interface IFocusableElement
  extends HTMLElement,
    HTMLOrSVGElement {
  focusElement(): void;
}
