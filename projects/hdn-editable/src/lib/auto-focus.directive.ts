import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[auto-focus]'
})
export class AutoFocusDirective {

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 0)
  }

}
