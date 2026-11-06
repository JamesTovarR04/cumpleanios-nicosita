import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cargando',
  imports: [MatProgressSpinnerModule, MatButtonModule],
  styleUrl: './cargando.scss',
  host: {
    '[class.oculto]': '!visible()',
    role: 'status',
    'aria-live': 'polite',
  },
  template: `
    <img src="globo.png" alt="" />
    @if (listo()) {
      <button mat-flat-button (click)="abrir.emit()">Abrir invitación</button>
    } @else {
      <mat-progress-spinner mode="indeterminate" diameter="40" />
      <p>Preparando tu invitación...</p>
    }
  `,
})
export class Cargando {
  visible = input(true);
  nombre = input('');
  listo = input(false); // recursos cargados: se muestra el botón para entrar
  abrir = output<void>();
}
