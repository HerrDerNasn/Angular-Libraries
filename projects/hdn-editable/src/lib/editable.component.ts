import { Component, OnInit, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { KeyboardConstants } from './key-constants';
import { EditableSelectDirective } from './editable-select.directive';

@Component({
  selector: 'editable-component',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent implements OnInit {

  @ViewChild(EditableSelectDirective, {static: false}) selectref : EditableSelectDirective;

  private initialValue;
  value: any;
  valueChanged: EventEmitter<any> = new EventEmitter;
  style;
  type: string;
  options: any[];
  selectFilter = "";
  topPlacement: boolean = false;


  private isFirstClick = true;

  constructor(public elRef: ElementRef) { }

  ngOnInit() {
    this.initialValue = this.value;
  }

  @HostListener('window:mousedown', ['$event'])
  mousedown(event: MouseEvent) {
    if (this.isFirstClick) {
      this.isFirstClick = false;
      return;
    }
    if (!this.elRef.nativeElement.contains(event.target)) {
      if (!this.selectref.editableref || !this.selectref.editableref.elementRef.nativeElement.contains(event.target)) {
        this.close();
      }
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.options || this.options.length == 0) {
      if (event.keyCode == KeyboardConstants.ESCAPE_KEY) {
        this.value = this.initialValue;
        this.close();
      } else if (event.keyCode == KeyboardConstants.ENTER_KEY) {
        this.close();
      }
    }
  }

  setFilter() {
    if (this.options && this.options.length > 0) {
      this.selectFilter = this.value;
    }
  }

  close() {
    this.valueChanged.emit(this.value);
    if (!!this.selectref) {
      this.selectref.hide()
    }
  }

  set editValue(value: any)  {
    this.value = value;
    this.initialValue = value;
  }

  selectChosen(event) {
    if (event) {
      this.value = event;
    } else {
      this.value = this.initialValue;
    }
    this.close();
  }

  updateSelect(topPlacement: boolean) {
    if(this.selectref) {
      this.selectref.updatePosition(topPlacement)
    }
  }
}
