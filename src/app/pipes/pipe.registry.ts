import { Injectable, PipeTransform } from '@angular/core';
import { DatePipe, CurrencyPipe, UpperCasePipe, LowerCasePipe } from '@angular/common';
import { EntityNamePipe } from './entity.name.pipe';

export interface PipeConfig {
    name: string;      // nom du pipe enregistré
    args?: any[];      // arguments optionnels du pipe
}

@Injectable({ providedIn: 'root' })
export class PipeRegistry {
    private pipes: Record<string, PipeTransform> = {};

    constructor() {
        // register Angular built-in pipes
        // On crée directement les instances des pipes Angular
        this.register('date', new DatePipe('en_EN'));
        this.register('currency', new CurrencyPipe('en_EN'));
        this.register('uppercase', new UpperCasePipe());
        this.register('lowercase', new LowerCasePipe());
        this.register('entityName', new EntityNamePipe())
    }

    register(name: string, pipe: PipeTransform) {
        this.pipes[name] = pipe;
    }

    resolve(name: string): PipeTransform | null {
        return this.pipes[name] ?? null;
    }
}
