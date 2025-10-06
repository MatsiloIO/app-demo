import { Component, inject } from '@angular/core';
import { Crud } from "../../crud/crud";
import { CategoryService } from '../../services/category.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { ColumnFactory } from '../../config/column.factory';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-category.component',
  imports: [Crud, ReactiveFormsModule],
  providers: [DatePipe],
  template: `
    <app-crud
      [entityName]="'Catégorie'"
      [columns]="columns"
      [formConfig]="formConfig"
      [service]="categoryService"
    />
  `,
  styles: ``
})
export default class CategoryComponent {
  categoryService = inject(CategoryService)
  formConfig = {
    name: ['', Validators.required]
  }

  columns = new ColumnFactory<Category>()
    .addTextColumn('name', 'Nom', true, 'text')
    .addDateColumn('created_at', 'Crée le', false, [{ name: 'date', args: ['dd/MM/yyyy'] }], 'right')
    .build()
}
