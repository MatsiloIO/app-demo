import { ColumnConfig, FieldType } from './column.config';
import { PipeConfig } from '../pipes/pipe.registry';

export class ColumnFactory<T> {
    private _columns: ColumnConfig<T>[] = [];

    /** Retourne les colonnes construites */
    build(): ColumnConfig<T>[] {
        return this._columns;
    }

    /** Colonne texte simple */
    addTextColumn(
        field: keyof T & string,
        label: string,
        editable: boolean = true,
        type: FieldType,
        pipes?: PipeConfig[],
        align: 'left' | 'center' | 'right' = 'left',
        display: boolean = true
    ): ColumnFactory<T> {
        this._columns.push({
            field,
            label,
            editable,
            type,
            pipes,
            align,
            display,
            format: (value: any) => value ?? ''
        });
        return this;
    }

    /** Colonne nombre */
    addNumberColumn(
        field: keyof T & string,
        label: string,
        editable: boolean = true,
        pipes?: PipeConfig[],
        align: 'left' | 'center' | 'right' = 'right',
        display: boolean = true
    ): ColumnFactory<T> {
        this._columns.push({
            field,
            label,
            editable,
            type: 'number',
            pipes,
            align,
            display,
            format: (value: any) => value ?? 0
        });
        return this;
    }

    /** Colonne date */
    addDateColumn(
        field: keyof T & string,
        label: string,
        editable: boolean = true,
        pipes?: PipeConfig[],
        align: 'left' | 'center' | 'right' = 'center',
        display: boolean = true
    ): ColumnFactory<T> {
        this._columns.push({
            field,
            label,
            editable,
            type: 'date',
            pipes,
            align,
            display,
            format: (value: any) => value ? new Date(value).toLocaleDateString() : ''
        });
        return this;
    }

    /** Colonne textarea */
    addTextAreaColumn(
        field: keyof T & string,
        label: string,
        editable: boolean = true,
        pipes?: PipeConfig[],
        align: 'left' | 'center' | 'right' = 'left',
        display: boolean = true
    ): ColumnFactory<T> {
        this._columns.push({
            field,
            label,
            editable,
            type: 'textarea',
            pipes,
            align,
            display,
            format: (value: any) => value ?? ''
        });
        return this;
    }

    /** Colonne relation 1,N (select) */
    addRelationColumn(
        field: keyof T & string,
        label: string,
        editable: boolean = true,
        entities: any[],
        valueKey: string = 'id',
        labelKey: string = 'name',
        align: 'left' | 'center' | 'right' = 'center',
        display: boolean = true
    ): ColumnFactory<T> {
        const options = entities.map(e => ({
            value: e[valueKey],
            label: e[labelKey]
        }));

        this._columns.push({
            field,
            label,
            editable,
            type: 'select',
            options,
            align,
            display,
            format: (value: any) => {
                const entity = entities.find(e => e[valueKey] === value);
                return entity ? entity[labelKey] : '';
            }
        });

        return this;
    }

    /** Colonne select simple */
    addSelectColumn(
        field: keyof T & string,
        label: string,
        options: Array<{ value: any; label: string }>,
        editable: boolean = true,
        pipes?: PipeConfig[],
        align: 'left' | 'center' | 'right' = 'center',
        display: boolean = true
    ): ColumnFactory<T> {
        this._columns.push({
            field,
            label,
            editable,
            type: 'select',
            options,
            pipes,
            align,
            display,
            format: (value: any) => {
                const opt = options.find(o => o.value === value);
                return opt ? opt.label : '';
            }
        });
        return this;
    }
}
