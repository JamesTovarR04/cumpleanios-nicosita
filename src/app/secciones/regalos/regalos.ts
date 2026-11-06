import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { REGALOS } from '../../datos';

@Component({
  selector: 'app-regalos',
  imports: [MatListModule, MatIconModule, MatDividerModule],
  styleUrl: './regalos.scss',
  template: `
    <section>
      <h1 class="titulos">
        <mat-icon>card_giftcard</mat-icon> Lista de regalos
      </h1>
      <p>
        " Tu presencia es el mejor regalo, pero si deseas tener un detalle, aquí
        hay algunas ideas. "
      </p>
      <mat-list class="regalos mx-auto">
        @for (r of regalos; track r.titulo; let last = $last) {
          <mat-list-item>
            <mat-icon matListItemIcon>{{ r.icono }}</mat-icon>
            <span matListItemTitle>{{ r.titulo }}</span>
            <span matListItemLine>{{ r.detalle }}</span>
          </mat-list-item>
          @if (!last) {
            <mat-divider />
          }
        }
      </mat-list>
    </section>
  `,
})
export class Regalos {
  regalos = REGALOS;
}
