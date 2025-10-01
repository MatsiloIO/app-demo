import { Injectable } from '@angular/core';

import { Product } from '../models/product.model';
import { GenericService } from './generic.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor() {
    super('products', ['name'])
  }
}
