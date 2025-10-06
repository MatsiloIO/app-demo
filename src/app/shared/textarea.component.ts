import { Component } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <fieldset class="fieldset">
      <legend class="fieldset-legend">{{label}}</legend>
      <textarea [formControl]="formControl" class="textarea h-24 w-full"></textarea>
      <p class="label">{{help}}</p>
    </fieldset>
  `,
  styles: ``
})
export class TextareaComponent {
  @Input() label = ''
  @Input() control!: AbstractControl
  @Input() help = ''

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
