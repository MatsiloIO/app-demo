import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  template: `
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{label}}</legend>
      <select [formControl]="formControl" class="select select-sm w-full">
        @for(opt of options;track opt){
          <option [value]="opt.value">{{opt.label}}</option>
        }
      </select>
    </fieldset>
  `,
  styles: ``
})
export class SelectComponent<T> {
  @Input() control!: AbstractControl
  @Input() label!: string
  @Input() options: { label: string, value: T }[] = []

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
