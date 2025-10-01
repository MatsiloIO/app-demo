import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GenericService<Client> {
  constructor() {
    super('clients', ['name', 'email'])
  }
}
