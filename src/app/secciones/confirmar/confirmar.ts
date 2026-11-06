import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Invitado } from '../../datos';

@Component({
  selector: 'app-confirmar',
  imports: [MatButtonModule, MatIconModule],
  styles: ':host { display: block; }',
  template: `
    <section class="alt p-b-5">
      <h3 class="mat-headline-medium">¿Nos acompañas?</h3>
      <a mat-flat-button [href]="enlace()" target="_blank" rel="noopener"
        ><mat-icon>chat</mat-icon>Confirmar por WhatsApp</a
      >
    </section>
  `,
})
export class Confirmar {
  whatsapp = input.required<string>();
  invitado = input<Invitado | null>(null);

  enlace = computed(() => {
    const n = this.invitado()?.nombre ?? 'un invitado';
    const t = `Hola! Soy ${n} y confirmo mi asistencia al cumpleaños de Nicolth 💜`;
    return `https://wa.me/${this.whatsapp()}?text=${encodeURIComponent(t)}`;
  });
}
