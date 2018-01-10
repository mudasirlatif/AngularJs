import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private ref: ElementRef, private rend: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.rend.addClass(this.ref.nativeElement, 'highlight');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.rend.removeClass(this.ref.nativeElement, 'highlight');
  }
}
