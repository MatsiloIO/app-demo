import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model'
@Component({
  selector: 'app-client',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="p-6 mx-auto">
    <h2 class="text-xl font-bold mb-4">Gestion des clients</h2>

    <!-- Bouton Créer -->
    <div class="flex justify-end mb-4">
      <button class="btn btn-primary" (click)="openForm()">Créer</button>
    </div>

    <!-- overlay -->
    <div class="fixed inset-0 bg-transparent bg-opacity-20 z-40 transition-opacity" [class.hidden]="!showForm"
        (click)="closeForm()">
    </div>

      <!-- Drawer formulaire -->
      <div class="fixed top-0 right-0 h-full w-1/3 bg-base-200 shadow-lg z-50 transform transition-transform duration-300"
          [class.translate-x-full]="!showForm"
          [class.translate-x-0]="showForm">
        <div class="p-6 flex flex-col h-full">
          <h3 class="text-lg font-bold mb-4">
            {{ editingClient ? 'Modifier le client' : 'Créer un client' }}
          </h3>

          <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="space-y-4 flex-1">
            <input type="text" formControlName="name" placeholder="Nom" class="input input-bordered w-full" />
            <input type="email" formControlName="email" placeholder="Email" class="input input-bordered w-full" />

            <div class="mt-auto flex gap-2">
              <button type="submit" class="btn btn-primary flex-1">
                {{ editingClient ? 'Mettre à jour' : 'Créer' }}
              </button>
              <button type="button" class="btn btn-outline" (click)="closeForm()">Annuler</button>
            </div>
          </form>
        </div>
      </div>

  <!-- Recherche -->
  <input
    type="text"
    placeholder="Recherche par nom ou email..."
    (input)="onSearchChange($event.target.value)"
    class="input input-bordered w-full mb-4"
  />
  <!-- Table clients -->
    @if(!loading && clients.length>0){
      <table class="table w-full">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Créé le</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (client of clients; track client.id) {
          <tr>
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.created_at | date:'dd/MM/yyyy' }}</td>
            <td class="flex gap-2 justify-end">
              <button class="btn btn-xs p-1 btn-info" (click)="openForm(client)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button class="btn btn-xs p-1 btn-error" (click)="delete(client.id!)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>
        }
      </tbody>
      </table>
    }

    @if(!loading && clients.length===0) {
      <div role="alert" class="alert alert-warning alert-soft">
        <span>No results found !</span>
      </div>
    }  
       
    @if(loading){
      <div class="flex justify-center my-6">
        <span class="loading loading-ring loading-lg"></span>
      </div>
    }

  <!-- Pagination simple -->
      <div class="flex justify-between mt-4">
        <button class="btn btn-accent" [disabled]="page === 1" (click)="onPageChange(page - 1)">Précédent</button>
        <span>Page {{ page }} / {{ pageCount }}</span>
        <button class="btn btn-accent" [disabled]="page * pageSize >= total" (click)="onPageChange(page + 1)">Suivant</button>
      </div>
  </div>
  `,
  styles: ``
})
export default class ClientComponent implements OnInit {

  clients: Client[] = []
  total = 0
  page = 1
  pageSize = 5
  search = ''
  clientForm!: FormGroup
  editingClient: Client | null = null
  fb = inject(FormBuilder)
  clientService = inject(ClientService)
  searchDebounceTimeout: any
  loading = false
  showForm = false

  openForm(client?: Client) {
    this.editingClient = client ?? null
    if (client) {
      this.clientForm.patchValue(client)
    } else {
      this.clientForm.reset()
    }
    this.showForm = true
  }

  closeForm() {
    this.showForm = false
    this.editingClient = null
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    })
    this.loadClients()
  }

  async delete(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ?')) {
      await this.clientService.delete(id)
      this.loadClients()
    }
  }

  async loadClients() {
    this.loading = true
    const { data, count } = await this.clientService.all(this.page, this.pageSize, this.search)
    this.loading = false
    this.clients = data
    this.total = count
  }

  async saveClient() {
    if (this.clientForm.invalid) return
    const formValue = this.clientForm.value
    if (this.editingClient) {
      await this.clientService.update(this.editingClient.id!, formValue)
    } else {
      await this.clientService.create(formValue)
    }
    this.clientForm.reset()
    this.editingClient = null
    this.loadClients()
    this.closeForm()
  }

  editClient(client: Client) {
    this.editingClient = client
    this.clientForm.patchValue(client)
  }

  onSearchChange(value: string) {
    // debouncing
    clearTimeout(this.searchDebounceTimeout)
    this.searchDebounceTimeout = setTimeout(() => {
      this.search = value
      this.page = 1
      this.loadClients()
    }, 500)
  }

  onPageChange(newPage: number) {
    this.page = newPage
    this.loadClients()
  }

  cancel() {
    this.clientForm.reset()
    this.editingClient = null
  }
}
