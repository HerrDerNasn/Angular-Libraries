import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms'
import { EditableDirective } from './editable.directive';
import { EditableComponent } from './editable.component';
import { EditableSelectComponent } from './editable-select.component';
import { EditableSelectDirective } from './editable-select.directive';
import { AutoFocusDirective } from './auto-focus.directive';

@NgModule({
  declarations: [
    EditableDirective,
    EditableComponent,
    EditableSelectComponent,
    EditableSelectDirective,
    AutoFocusDirective
  ],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule
  ],
  exports: [
    EditableDirective
  ],
  entryComponents: [
    EditableComponent,
    EditableSelectComponent
  ]
})
export class HdnEditableModule { }
