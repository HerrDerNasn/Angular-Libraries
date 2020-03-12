import { Directive, Input, Output, EventEmitter, ElementRef, HostListener, ComponentRef, SimpleChanges } from '@angular/core';
import { OverlayPositionBuilder, Overlay, OverlayRef, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { EditableComponent } from './editable.component';
import { Subscription } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[editable]'
})
export class EditableDirective {

  @Input() editable: string = "text";
  @Input() select: any[];
  @Input() editableValue: any;
  @Input() disabled: boolean = false;
  @Output() editableValueChange: EventEmitter<any> = new EventEmitter();

  overlayRef: OverlayRef;
  editableref: EditableComponent;
  editableRefEvent: Subscription;

  constructor(private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private overlay: Overlay) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled) {
      if (this.disabled) {
        this.hide();
      }
    }
  }

  @HostListener('mousedown', ["$event"])
  mousedown(event: MouseEvent) {
    if (!this.overlayRef) {
      this.show();
    }
  }

  show() {
    if (!this.disabled) {
      const positionStrategy = this.positionStrategy;
      this.overlayRef = this.overlay.create({ positionStrategy });
      const ref: ComponentRef<EditableComponent> = this.overlayRef.attach(new ComponentPortal(EditableComponent));
      this.editableref = ref.instance;
      this.setBaseComponentValues();
      this.editableRefEvent = this.valueChangedSubscription();
      window.addEventListener("scroll", this.updatePosition)
      window.addEventListener("resize", this.updatePosition)
    }
  }

  valueChangedSubscription() {
    return this.editableref.valueChanged.subscribe((newValue: any) => {
      this.editableValueChange.emit(newValue);
      this.hide();
    })
  }

  updatePosition = (event) => {
    this.overlayRef.updatePosition();
    this.editableref.updateSelect((window.innerHeight - this.elementRef.nativeElement.getBoundingClientRect().bottom) <= 100);
  }

  hide() {
    if(this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = undefined;
      this.editableref = undefined;
    }
    if(this.editableRefEvent) {
      this.editableRefEvent.unsubscribe();
    }
    window.removeEventListener("scroll", this.updatePosition)
    window.removeEventListener("resize", this.updatePosition)
  }

  setBaseComponentValues() {
    this.editableref.style = this.getStylesFromParent(this.elementRef.nativeElement)
    this.editableref.editValue = this.editableValue;
    this.editableref.type = this.editable;
    this.editableref.options = this.select;
    this.editableref.topPlacement = (window.innerHeight - this.elementRef.nativeElement.getBoundingClientRect().bottom) <= 100
  }

  get positionStrategy(): FlexibleConnectedPositionStrategy {
    return this.overlayPositionBuilder
               .flexibleConnectedTo(this.elementRef)
               .withPositions([{
                 originX: 'start',
                 originY: 'top',
                 overlayX: 'start',
                 overlayY: 'top'
               }])
               .withPush(false);
  }

  getStylesFromParent(nativeElement: any) {
    const style = window.getComputedStyle(nativeElement);
    return {
      border: style.border,
      width: style.width,
      height: style.height,
      padding: style.padding,
      font: style.font,
      textAlign: style.textAlign,
      color: style.color,
      backgroundColor: style.backgroundColor == 'rgba(0, 0, 0, 0)' ? 'rgba(255, 255, 255, 100)' : style.backgroundColor
    }
  }
}