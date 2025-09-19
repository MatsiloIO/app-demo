import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-4">
        <h1>Listes des produits</h1>
        <button class="btn btn-primary" routerLink="/add-product">Ajouter produit</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
           @for (prod of productService.products(); track prod.id) {
            <tr>
              <td>{{prod.name}}</td>
              <td class="text-right">{{prod.price | currency}}</td>
              <td>{{prod.created_at}}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``
})
export default class Products implements OnInit {

  productService = inject(ProductService)

  ngOnInit(): void {
    this.productService.loadProducts()
  }
}
