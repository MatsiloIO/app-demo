import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category> {
  constructor() {
    super('categories', ['name'])
  }
}
