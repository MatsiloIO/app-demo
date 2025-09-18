import { Component } from '@angular/core';
import { Products } from "../products/products";

@Component({
  selector: 'app-home',
  imports: [Products],
  template: `
    <h1>Listes des produits</h1>
    <app-products/>
  `,
  styles: ``
})
export default class Home {

}
