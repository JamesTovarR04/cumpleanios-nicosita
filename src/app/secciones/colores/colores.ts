import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { COLORES_REGALO } from '../../datos';

@Component({
  selector: 'app-colores',
  imports: [MatIconModule],
  styleUrl: './colores.scss',
  template: `
    <section class="m-b-4">
      <h1 class="titulos"><mat-icon>palette</mat-icon> Colores sugeridos</h1>
      <p>
        Para el papel y la bolsa de regalo, estos tonos combinan con la fiesta.
      </p>
      <div class="muestras">
        @for (c of colores; track c.hex) {
          <div class="muestra">
            <span class="circulo" [style.background]="c.hex"></span>
            <span class="mat-label-large">{{ c.nombre }}</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class Colores {
  colores = COLORES_REGALO;
}
