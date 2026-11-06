import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-generador',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header><mat-card-title>Generador de enlaces</mat-card-title></mat-card-header>
      <mat-card-content>
        <mat-form-field><mat-label>Nombre</mat-label><input matInput [(ngModel)]="nombre" /></mat-form-field>
        <mat-form-field>
          <mat-label>Sexo</mat-label>
          <mat-select [(ngModel)]="sexo"><mat-option value="F">Femenino</mat-option><mat-option value="M">Masculino</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field><mat-label>Cupos</mat-label><input matInput type="number" min="1" [(ngModel)]="cupos" /></mat-form-field>
        <p style="word-break: break-all">{{ enlace() }}</p>
      </mat-card-content>
      <mat-card-actions><button mat-flat-button (click)="copiar()">{{ copiado() ? '¡Copiado!' : 'Copiar enlace' }}</button></mat-card-actions>
    </mat-card>
  `,
  styles: `
    :host { display: block; padding: 2rem 1rem; }
    mat-card { max-width: 460px; margin: auto; padding: 1rem; }
    mat-form-field { display: block; }
  `,
})
export class Generador {
  nombre = '';
  sexo = 'F';
  cupos = 1;
  copiado = signal(false);

  enlace() {
    const p = new URLSearchParams();
    if (this.nombre) p.set('nombre', this.nombre);
    p.set('sexo', this.sexo);
    p.set('cupos', String(this.cupos || 1));
    const base = location.href.split('#')[0].replace(/\/$/, '');
    return `${base}/#/?${p.toString()}`;
  }
  async copiar() {
    await navigator.clipboard.writeText(this.enlace());
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }
}
