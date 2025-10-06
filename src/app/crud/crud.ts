import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnConfig } from '../config/column.config';
import { PipeRegistry } from '../pipes/pipe.registry';
import { FormFieldComponent } from "../shared/form-field.component";
@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <div class="mx-auto">
      <h2 class="text-xl font-bold mb-4">Gestion des {{ entityName.toLowerCase()+'s' }}</h2>

      <!-- Bouton créer -->
      <div class="flex justify-end mb-4">
        <button class="btn btn-xs btn-primary" (click)="openForm()">Créer</button>
      </div>

      <!-- Overlay -->
      <div class="fixed inset-0 bg-base-100 z-40" [class.hidden]="!showForm" (click)="closeForm()"></div>

      <!-- Drawer -->
      <div class="fixed top-0 right-0 h-full sm:w-1/2 lg:w-1/3 bg-base-200 shadow-lg z-50 transition-transform"
          [class.translate-x-full]="!showForm"
          [class.translate-x-0]="showForm">

        <!-- ✅ Conteneur scrollable -->
        <div class="flex flex-col h-full overflow-y-auto">
          <div class="p-6 flex-1">
            <h3 class="text-lg font-bold mb-4">
              {{ editingItem ? 'Modifier' : 'Créer' }} {{ entityName.toLowerCase() }}
            </h3>

            <form [formGroup]="form" class="space-y-4">
              @for (col of columns; track col) {
                <app-form-field [form]="form" [col]="col" />
              }

              <div class="py-4 flex justify-start gap-2">
                <button type="button" class="btn btn-sm btn-primary" (click)="save()">Sauvegarder</button>
                <button type="button" class="btn btn-sm btn-warning" (click)="closeForm()">Annuler</button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <!-- Recherche -->
      <input type="text" placeholder="Recherche..."
            (input)="onSearchChange($event.target.value)"
            class="input input-sm input-bordered w-full mb-4" />

      <!-- Table -->
      @if(!loading && items.length > 0){
        <table class="table table-xs w-full">
          <thead>
            <tr>
              @for(col of columns;track col){
                @if(col.display){
                  <th [class.text-right]="col.align==='right'" [class.text-center]="col.align==='center'">{{ col.label }}</th>
                }
              }
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for(item of items;track item.id){
            <tr>
              @for(col of columns; track col){
                @if(col.display){
                  <td [class.text-right]="col.align==='right'" [class.text-center]="col.align==='center'">
                    {{ col.format ? col.format(item[col.field]) : item[col.field] }}
                  </td>
                }
              }
              <td class="flex gap-2 justify-end">
                <button class="btn btn-xs p-1 btn-ghost" (click)="openForm(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-green-400">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                </button>
                <button class="btn btn-xs p-1 btn-ghost" (click)="delete(item.id!)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-red-300">
                    <path fill-rule="evenodd" d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>

      <!-- Pagination -->
      <div class="flex justify-between mt-4">
        <button class="btn btn-xs btn-accent" [disabled]="page === 1" (click)="onPageChange(page - 1)">Précédent</button>
        <span class="text-xs">Page {{ page }} / {{ pageCount }}</span>
        <button class="btn btn-xs btn-accent" [disabled]="page * pageSize >= total" (click)="onPageChange(page + 1)">Suivant</button>
      </div>
      }
      

      <!-- Aucun résultat --> 
      @if(!loading && items.length===0){
        <div class="toast toast-center toast-middle">
          <div class="alert alert-info">
            <span>Aucune donnée trouvé pour {{ucWord(entityName)}} </span>
          </div>
        </div>
      }
      <!-- Loader -->
      @if(loading){
        <div class="flex justify-center my-6">
          <span class="loading loading-ring loading-lg text-success"></span>
        </div>
      }
    </div>
  `,
  styles: ``
})

export class Crud<T extends { id?: string }> implements OnInit {

  @Input() entityName = ''
  @Input() columns: ColumnConfig<T>[] = []
  @Input() service!: {
    all: (page: number, pageSize: number, search: string) => Promise<{ data: T[], count: number }>,
    create: (data: Partial<T>) => Promise<T | null>,
    update: (id: string, data: Partial<T>) => Promise<T | null>,
    delete: (id: string) => Promise<void>
  }

  @Input() formConfig: { [K in keyof T]?: any } = {}; // ex: { name: ['', Validators.required], email: ['', [Validators.email]] }

  // /** Evènements externe si besoin */
  @Output() created = new EventEmitter<T>()
  @Output() updated = new EventEmitter<T>()
  @Output() deleted = new EventEmitter<string>()

  ngOnInit(): void {
    this.form = this.fb.group(this.formConfig)
    this.load()
  }

  ucWord(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
  pipeRegistry = inject(PipeRegistry)

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

  // openForm(item?: T) {
  //   this.editingItem = item ?? null;
  //   if (item) {
  //     this.form.patchValue(item);
  //   } else {
  //     this.form.reset();
  //   }
  //   this.showForm = true;
  // }
  openForm(item?: T) {
    this.editingItem = item ?? null;

    if (item) {
      const formValue = { ...item } as any;
      // Conversion des champs date
      this.columns.forEach(col => {
        if (col.type === 'date' && formValue[col.field]) {
          // garde seulement yyyy-MM-dd
          formValue[col.field] = formValue[col.field].split('T')[0];
        }
      });
      this.form.patchValue(formValue);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    };

    const value = this.form.value;
    if (this.editingItem?.id) {
      await this.service.update(this.editingItem.id, value);
      this.updated.emit({ ...this.editingItem, ...value } as T);
    } else {
      await this.service.create(value);
      this.created.emit(value as T);
    }
    this.load();
    this.closeForm();
  }

  async delete(id: string) {
    if (confirm(`Supprimer cet ${this.entityName.toLowerCase()} ?`)) {
      await this.service.delete(id);
      this.deleted.emit(id);
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

  // formatValue(item: T, col: ColumnConfig<T>): any {
  //   let value = item[col.field];
  //   if (!col.pipes?.length) return value;

  //   // appliquer chaque pipe dans l'ordre
  //   return col.pipes.reduce((acc, pipeConfig: PipeConfig) => {
  //     const pipe = this.pipeRegistry.resolve(pipeConfig.name);
  //     return pipe ? (pipeConfig.args ? pipe.transform(acc, ...pipeConfig.args) : pipe.transform(acc)) : acc;
  //   }, value);
  // }

}
