import { Component } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{label}}</legend>
      <input [formControl]="formControl" [type]="type" class="input input-sm w-full"/>
      <p class="label">{{help}}</p>
    </fieldset>
  `,
  styles: ``
})
export class InputComponent {
  @Input() label = ''
  @Input() control!: AbstractControl
  @Input() type = 'text'
  @Input() help = ''

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
