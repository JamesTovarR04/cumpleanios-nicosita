import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegaloDB } from '../../supabase.service';

export interface DatosRegalo {
  regalo: RegaloDB;
  puedeElegir: boolean; // hay un invitado identificado
}

export function textoCantidad(n: number) {
  return n === 0 ? 'Nadie lo ha elegido aún' : n === 1 ? '1 persona lo llevará' : `${n} personas lo llevarán`;
}

@Component({
  selector: 'app-regalo-dialogo',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  styles: `
    img { display: block; width: 100%; max-height: 50vh; object-fit: contain; border-radius: 12px; margin-bottom: 1rem; }
    .cantidad { display: flex; align-items: center; gap: .5rem; margin-top: 1rem; font-weight: 500; }
    p { white-space: pre-line; }
  `,
  template: `
    <h2 mat-dialog-title>{{ d.regalo.titulo }}</h2>
    <mat-dialog-content>
      @if (d.regalo.imagen) {
        <img [src]="d.regalo.imagen" [alt]="d.regalo.titulo" />
      }
      <p>{{ d.regalo.detalle }}</p>
      @if (d.regalo.unico) {
        <p><em>Regalo único: solo una persona puede llevarlo.</em></p>
      }
      <div class="cantidad"><mat-icon>group</mat-icon>{{ texto }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (d.regalo.link) {
        <a mat-button [href]="d.regalo.link" target="_blank" rel="noopener"><mat-icon>open_in_new</mat-icon>Ver</a>
      }
      <button mat-button mat-dialog-close>Cerrar</button>
      @if (d.puedeElegir) {
        @if (d.regalo.elegido) {
          <button mat-stroked-button [mat-dialog-close]="'quitar'">Ya no lo llevaré</button>
        } @else if (d.regalo.tomado) {
          <button mat-flat-button disabled>Reservado</button>
        } @else {
          <button mat-flat-button [mat-dialog-close]="'elegir'"><mat-icon>check</mat-icon>Confirmar que lo llevaré</button>
        }
      }
    </mat-dialog-actions>
  `,
})
export class RegaloDialogo {
  d = inject<DatosRegalo>(MAT_DIALOG_DATA);
  texto = textoCantidad(this.d.regalo.cantidad);
}
