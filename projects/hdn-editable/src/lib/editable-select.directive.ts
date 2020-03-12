import { Directive, ElementRef, Input, ComponentRef, Output, EventEmitter } from '@angular/core';
import { OverlayPositionBuilder, Overlay, FlexibleConnectedPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { EditableSelectComponent } from './editable-select.component';

@Directive({
  selector: '[editable-select]'
})
export class EditableSelectDirective {

  @Input('editable-select') options: any[];
  @Input() selectStyle: any;
  @Input() selectFilter: string = "";
  @Input() topPlacement: boolean = false;
  @Output() chosen: EventEmitter<any> = new EventEmitter();

  overlayRef: OverlayRef;
  editableref: EditableSelectComponent;
  editableRefEvent: Subscription;

  constructor(private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private overlay: Overlay) {
  }

  ngOnInit() {
    if (this.options != undefined && this.options.length > 0) {
      this.show();
    }
  }

  ngOnChanges(changes) {
    if (!!changes.selectFilter && !!this.editableref) {
      this.editableref.filter = this.selectFilter;
    }
  }

  show() {
    const positionStrategy = this.positionStrategy;
    this.overlayRef = this.overlay.create({ positionStrategy });
    const ref: ComponentRef<EditableSelectComponent> = this.overlayRef.attach(new ComponentPortal(EditableSelectComponent));
    this.editableref = ref.instance;
    this.setBaseComponentValues();
    this.editableRefEvent = this.editableref.chosen.subscribe((newValue: any) => {
      this.chosen.emit(newValue);
      this.hide();
    })
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
  }

  setBaseComponentValues() {
    this.editableref.options = this.options;
    this.editableref.filtered = this.options;
    this.editableref.style = this.selectStyle;
    this.editableref.setCalcedStyle();
  }

  get positionStrategy(): FlexibleConnectedPositionStrategy {
    if (this.topPlacement) {
      return this.overlayPositionBuilder
                  .flexibleConnectedTo(this.elementRef)
                  .withPositions([{
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom'
                  }])
                  .withPush(false);
    }
    return this.overlayPositionBuilder
               .flexibleConnectedTo(this.elementRef)
               .withPositions([{
                 originX: 'center',
                 originY: 'bottom',
                 overlayX: 'center',
                 overlayY: 'top'
               }])
               .withPush(false);
  }

  updatePosition(topPlacement: boolean) {
    if (this.overlayRef) {
      if (this.topPlacement != topPlacement) {
        this.topPlacement = topPlacement
        const positionStrategy = this.positionStrategy;
        this.overlayRef.updatePositionStrategy(positionStrategy)
      }
      this.overlayRef.updatePosition()
    }
  }
}
