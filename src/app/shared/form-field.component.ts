// form-field.component.ts (version qui accepte form)
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ColumnConfig } from '../config/column.config';
import { InputComponent } from "./input.component";
import { TextareaComponent } from "./textarea.component";
import { DateComponent } from "./date.component";
import { SelectComponent } from "./select.component";

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [InputComponent, TextareaComponent, DateComponent, SelectComponent],
    template: `
    @if (control && col) {
        @switch(col.type) {
            @case('text') { <app-input [control]="control" [label]="col.label" /> }
            @case('email') { <app-input [control]="control" [label]="col.label" type="email" /> }
            @case('number') { <app-input [control]="control" [label]="col.label" type="number" /> }
            @case('textarea') { <app-textarea [control]="control" [label]="col.label" /> }
            @case('date') { <app-date [control]="control" [label]="col.label" /> }
            @case('select') { <app-select [control]="control" [label]="col.label" [options]="col.options ?? []" /> }
            @default { <div>Type inconnu: {{ col.type }}</div> }
        }
    }
    <!-- ✅ Message d'erreur dynamique -->
      @if (control?.invalid && (control?.dirty || control?.touched)) {
        <span class="text-xs text-red-400">{{ getErrorMessage(control!) }}</span>
      }
  `
})
export class FormFieldComponent {
    @Input() form!: FormGroup;
    @Input() col!: ColumnConfig<any>;

    get control(): FormControl | null {
        return this.form?.get(this.col.field.toString()) as FormControl ?? null;
    }

    getErrorMessage(control: FormControl): string {
        const errors = control.errors as { [key: string]: any } | null;
        if (!errors) return '';
        if (errors['required']) return 'Ce champ est obligatoire';
        if (errors['email']) return 'Email invalide';
        if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
        if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
        return 'Valeur invalide';
    }


}
