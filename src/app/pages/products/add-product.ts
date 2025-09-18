import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ProductService } from '../../services/product.service';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-add-product',
  imports: [FormsModule, RouterLink],
  template: `
    <h2>Formulaire d'enregistrement d'un produit</h2>
    <form (ngSubmit)="addProduct()">
      <div class="flex flex-col gap-5 my-4">
        <input [(ngModel)]="name" type="text" name="name" placeholder="Name of product" class="input w-full" autocomplete="off" required/>
        <input [(ngModel)]="price" type="number" name="price" placeholder="Price" class="input w-full" />
      </div>
      <div class="flex justify-between items-center">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-accent" routerLink="/products">Listes des produits</button>
      </div>
    </form>
  `,
  styles: ``
})
export default class AddProduct {

  productService = inject(ProductService)
  name: string = ''
  price: number = 0

  async addProduct() {
    if (this.name.length > 0 && this.price > 0) {
      await this.productService.addProduct(this.name, this.price)
      this.name = ''
      this.price = 0
    }
  }
}
