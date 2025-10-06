import { PipeConfig } from '../pipes/pipe.registry';

export type Align = 'left' | 'center' | 'right';
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'date' | 'textarea' | 'relation';
export interface ColumnConfig<T> {
  field: keyof T;
  label: string;
  editable?: boolean;
  type: FieldType
  options?: Array<{ label: string; value: any }>;
  pipes?: PipeConfig[];
  align?: Align;
  display?: boolean;

  /** Nouveau : formatage personnalisé */
  format?: (value: any, item?: T) => any;

  /** Nouveau : relation (ex. catégorie, type, etc.) */
  relation?: {
    entities: any[];
    valueKey: string;
    labelKey: string;
  };
}
