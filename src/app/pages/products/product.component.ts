import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Crud } from '../../crud/crud';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ColumnFactory } from '../../config/column.factory';
import { EntityNamePipe } from '../../pipes/entity.name.pipe';
import { ColumnConfig } from '../../config/column.config';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [Crud, ReactiveFormsModule],
  providers: [DatePipe, CurrencyPipe, EntityNamePipe],
  template: `
    <app-crud
      [entityName]="'produit'"
      [columns]="columns"
      [formConfig]="formConfig"
      [service]="productService"
    />
  `,
  styles: ``
})
export default class ProductComponent implements OnInit {
  productService = inject(ProductService)
  categoryService = inject(CategoryService)
  categories: Category[] = []
  columns: ColumnConfig<Product>[] = []

  formConfig = {
    name: ['', Validators.required],
    price: [0, Validators.min(0)],
    category_id: [''],
  }

  async ngOnInit() {
    this.categories = await this.categoryService.allWithoutPagination()
    this.columns = new ColumnFactory<Product>()
      .addTextColumn('name', 'Nom', true, 'text')
      .addNumberColumn('price', 'Prix', true, [{ name: 'currency', args: ['USD'] }], 'right')
      .addRelationColumn('category_id', 'Catégorie', true, this.categories, 'id', 'name', 'center', true)
      .addDateColumn('created_at', 'Crée le', false, [{ name: 'date', args: ['dd/MM/yyyy'] }], 'right')
      .build();
  }
}
