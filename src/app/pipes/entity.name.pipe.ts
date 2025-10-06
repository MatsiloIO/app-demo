import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'entityName', standalone: true })
export class EntityNamePipe implements PipeTransform {
    transform(value: number | string | null | undefined, collection: any[], key = 'id', display = 'name'): string {
        if (!value || !collection) return '';
        const found = collection.find(item => item[key] === value);
        return found ? found[display] : '';
    }
}
