import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms'
import { Crud } from "../../crud/crud";
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [Crud, ReactiveFormsModule],
  template: `
    <app-crud 
      [entityName]="'Client'"
      [columns]="[
        {field: 'name', label:'Nom'},
        {field: 'email', label:'Email'}
      ]"
      [formConfig]="formConfig"
      [service]="clientService"
    />
  `,
  styles: ``
})
export default class ClientComponent {

  clientService = inject(ClientService)
  formConfig = {
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  }
}
