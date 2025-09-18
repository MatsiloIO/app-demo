import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe],
  template: `
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
           @for (prod of productService.products(); track prod.id) {
            <tr>
              <th>{{prod.id}}</th>
              <td>{{prod.name}}</td>
              <td>{{prod.price | currency}}</td>
              <td>{{prod.created_at}}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``
})
export class Products implements OnInit {

  productService = inject(ProductService)

  ngOnInit(): void {
    this.productService.loadProducts()
  }
}
