import { Component, OnInit, HostListener, EventEmitter, ElementRef } from '@angular/core';
import { KeyboardConstants } from './key-constants';

@Component({
  selector: 'app-editable-select',
  templateUrl: './editable-select.component.html',
  styleUrls: ['./editable-select.component.scss']
})
export class EditableSelectComponent implements OnInit {



  chosen: EventEmitter<any> = new EventEmitter();

  options: any[];
  filtered: any[] = [];
  style;
  calcedStyle;

  markedIndex = 0;

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit() {
    
  }

  @HostListener('document:keydown', ['$event'])
  selectKeydown(event: KeyboardEvent) {
    if (event.keyCode == KeyboardConstants.ARROWDOWN) {
      if (this.markedIndex + 1 < this.options.length) {
        this.markedIndex++;
      }
    } else if (event.keyCode == KeyboardConstants.ARROWUP) {
      if (this.markedIndex - 1 >= 0) {
        this.markedIndex--
      }
    } else if (event.keyCode == KeyboardConstants.ENTER_KEY) {
      this.chooseMarked();
    } else if (event.keyCode == KeyboardConstants.ESCAPE_KEY) {
      this.chosen.emit(undefined);
    }
  }

  chooseMarked() {
    if (this.filtered.length == 0) return; 
    this.chosen.emit(this.filtered[this.markedIndex]);
  }

  set filter(filter: string) {
    this.filtered = this.options.filter(option => option.includes(filter));
    this.markedIndex = 0;
  }

  setCalcedStyle() {
    let r = /\d+/g
    let paddings = this.style.padding.match(r);
    let widths = this.style.width.match(r);
    let width = Number(widths[0])
    if (paddings.length == 1) {
      width += 2 * Number(paddings[0])
    } else if (paddings.length == 2) {
      width += 2 * Number(paddings[1])
    } else if (paddings.length == 4) {
      width += Number(paddings[1]) + Number(paddings[2])
    }
    this.calcedStyle = {
      font: this.style.font,
      width: width + "px"
    }
  }

}
