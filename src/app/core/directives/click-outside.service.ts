// src/app/core/directives/click-outside.directive.ts

import { Directive, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnDestroy {
  @Output() appClickOutside = new EventEmitter<Event>();

  private onClick: any;

  constructor(private elementRef: ElementRef) {
    this.onClick = this.onDocumentClick.bind(this);
    document.addEventListener('mousedown', this.onClick);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.onClick);
  }

  private onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.appClickOutside.emit(event);
    }
  }
}
