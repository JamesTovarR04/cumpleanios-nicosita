import { Component, HostListener, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-boton-scroll',
  imports: [MatButtonModule, MatIconModule],
  styleUrl: './boton-scroll.scss',
  template: `
    <button mat-fab [class.rebota]="!alFinal()" [attr.aria-label]="alFinal() ? 'Volver arriba' : 'Ver más información'" (click)="mover()">
      <mat-icon>{{ alFinal() ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
    </button>
  `,
})
export class BotonScroll {
  alFinal = signal(false);

  @HostListener('window:scroll')
  @HostListener('window:resize')
  actualizar() {
    const el = document.documentElement;
    this.alFinal.set(window.scrollY + window.innerHeight >= el.scrollHeight - 40);
  }

  mover() {
    if (this.alFinal()) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  }
}