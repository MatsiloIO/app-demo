import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  template: `
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{label}}</legend>
      <input type="date" [formControl]="formControl" class="input input-sm w-full" />
    </fieldset>
  `,
  styles: ``
})
export class DateComponent {
  @Input() control!: AbstractControl
  @Input() label!: string

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
