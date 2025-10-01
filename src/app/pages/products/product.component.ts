import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Crud } from '../../crud/crud';
import { ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [Crud, ReactiveFormsModule],
  template: `
    <app-crud
      [entityName]="'Product'"
      [columns]="[
        {field: 'name', label:'Nom'},
        {field: 'price',label: 'Prix',pipe: formatPrice}
      ]"
      [formConfig]="formConfig"
      [service]="productService"
    />
  `,
  styles: ``
})
export default class ProductComponent {

  productService = inject(ProductService)

  formConfig = {
    name: ['', Validators.required],
    price: [0, Validators.min(0)]
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}
