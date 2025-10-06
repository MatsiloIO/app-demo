import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms'
import { Crud } from "../../crud/crud";
import { ClientService } from '../../services/client.service';
import { ColumnFactory } from '../../config/column.factory';
import { ColumnConfig } from '../../config/column.config';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [Crud, ReactiveFormsModule],
  template: `
    <app-crud 
      [entityName]="'client'"
      [columns]="columns"
      [formConfig]="formConfig"
      [service]="clientService"
    />
  `,
  styles: ``
})
export default class ClientComponent {

  clientService = inject(ClientService)
  columns: ColumnConfig<Client>[] = [];
  formConfig: { [K in keyof Client]?: any } = {};

  async ngOnInit() {
    this.columns = new ColumnFactory<Client>()
      .addTextColumn('name', 'Nom', true, 'text')
      .addTextColumn('email', 'Email', true, 'email')
      .addDateColumn('created_at', 'Créé le', false)
      .build();

    this.formConfig = {
      name: ['', Validators.required],
      email: [''],
    };
  }

}
