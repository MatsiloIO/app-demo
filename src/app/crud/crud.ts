import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface ColumnConfig<T> {
  field: keyof T,
  label: string,
  pipe?: ((value: any) => any) | ((value: any) => any)[]
};

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto">
      <h2 class="text-xl font-bold mb-4">Gestion des {{ entityName.toLowerCase()+'s' }}</h2>

      <!-- Bouton créer -->
      <div class="flex justify-end mb-4">
        <button class="btn btn-xs btn-primary" (click)="openForm()">Créer</button>
      </div>

      <!-- Overlay -->
      <div class="fixed inset-0 bg-transparent z-40" [class.hidden]="!showForm" (click)="closeForm()"></div>

      <!-- Drawer -->
      <div class="fixed top-0 right-0 h-full sm:w-1/2 lg:w-1/3 bg-base-200 shadow-lg z-50 transition-transform"
          [class.translate-x-full]="!showForm" [class.translate-x-0]="showForm">
        <div class="p-6 flex flex-col h-full">
          <h3 class="text-lg font-bold mb-4">
            {{ editingItem ? 'Modifier' : 'Créer' }} {{ entityName.toLowerCase() }}
          </h3>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4 flex-1">
            <ng-container *ngFor="let col of columns">
              <input [type]="col.field==='email'?'email':'text'" [formControlName]="col.field.toString()" [placeholder]="col.label" class="input input-sm input-bordered w-full">
            </ng-container>
            <div class="mt-auto flex justify-between gap-2">
              <button type="submit" class="btn btn-sm btn-primary">
                {{ editingItem ? 'Mettre à jour' : 'Créer' }}
              </button>
              <button type="button" class="btn btn-sm btn-outline" (click)="closeForm()">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Recherche -->
      <input type="text" placeholder="Recherche..."
            (input)="onSearchChange($event.target.value)"
            class="input input-sm input-bordered w-full mb-4" />

      <!-- Table -->
      <table *ngIf="!loading && items.length > 0" class="table table-xs w-full">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td *ngFor="let col of columns" [class.text-right]="typeof item[col.field]==='number'">{{ formatValue(item,col) }}</td>
            <td class="flex gap-2 justify-end">
              <button class="btn btn-xs p-1 btn-ghost" (click)="openForm(item)">✏️</button>
              <button class="btn btn-xs p-1 btn-ghost" (click)="delete(item.id!)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Aucun résultat --> 
      @if(!loading && items.length===0){
        <div class="alert alert-warning">Aucun {{ entityName }} trouvé</div>
      }
      <!-- Loader -->
      @if(loading){
        <div class="flex justify-center my-6">
          <span class="loading loading-ring loading-lg text-success"></span>
        </div>
      }
      
      <!-- Pagination -->
      <div class="flex justify-between mt-4">
        <button class="btn btn-xs btn-accent" [disabled]="page === 1" (click)="onPageChange(page - 1)">Précédent</button>
        <span class="text-xs">Page {{ page }} / {{ pageCount }}</span>
        <button class="btn btn-xs btn-accent" [disabled]="page * pageSize >= total" (click)="onPageChange(page + 1)">Suivant</button>
      </div>
    </div>
  `,
  styles: ``
})

export class Crud<T extends { id?: string }> implements OnInit {

  @Input() entityName = "Item"
  @Input() columns: ColumnConfig<T>[] = []
  @Input() service!: {
    all: (page: number, pageSize: number, search: string) => Promise<{ data: T[], count: number }>,
    create: (data: Partial<T>) => Promise<T | null>,
    update: (id: string, data: Partial<T>) => Promise<T | null>,
    delete: (id: string) => Promise<void>
  }

  @Input() formConfig: { [K in keyof T]?: any } = {}; // ex: { name: ['', Validators.required], email: ['', [Validators.email]] }

  // /** Evènements externe si besoin */
  // @Output() created = new EventEmitter<T>()
  // @Output() updated = new EventEmitter<T>()
  // @Output() deleted = new EventEmitter<string>()

  ngOnInit(): void {
    this.form = this.fb.group(this.formConfig)
    this.load()
  }

  /** Commons data */
  items: T[] = []
  total = 0
  page = 1
  pageSize = 10
  search = ''
  form!: FormGroup
  editingItem: T | null = null
  loading = false
  showForm = false
  private searchDebounce: any
  fb = inject(FormBuilder)

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  async load() {
    this.loading = true;
    const { data, count } = await this.service.all(this.page, this.pageSize, this.search);
    this.items = data;
    this.total = count;
    this.loading = false;
  }

  openForm(item?: T) {
    this.editingItem = item ?? null;
    if (item) {
      this.form.patchValue(item);
    } else {
      this.form.reset();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
  }

  async save() {
    if (this.form.invalid) return;

    const value = this.form.value;
    if (this.editingItem?.id) {
      await this.service.update(this.editingItem.id, value);
      // this.updated.emit({ ...this.editingItem, ...value } as T);
    } else {
      await this.service.create(value);
      // this.created.emit(value as T);
    }
    this.load();
    this.closeForm();
  }

  async delete(id: string) {
    if (confirm(`Supprimer cet ${this.entityName.toLowerCase()} ?`)) {
      await this.service.delete(id);
      // this.deleted.emit(id);
      this.load();
    }
  }

  onSearchChange(value: string) {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.search = value;
      this.page = 1;
      this.load();
    }, 500);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.load();
  }

  formatValue(item: T, col: ColumnConfig<T>): any {
    const value = item[col.field]
    if (!col.pipe) return value
    if (typeof col.pipe === 'function') {
      return col.pipe(value)
    }
    return (col.pipe as Array<(value: any) => any>).reduce((acc, fn) => fn(acc), value)
  }
}
