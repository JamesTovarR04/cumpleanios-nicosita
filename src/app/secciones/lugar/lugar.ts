import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lugar',
  imports: [MatButtonModule, MatIconModule],
  styleUrl: './lugar.scss',
  template: `
    <section>
      <h1 class="titulos"><mat-icon>place</mat-icon> Lugar</h1>
      <p class="lugar">{{ lugar() }}<br />{{ barrio() }}</p>
      <iframe
        class="mapa"
        [src]="mapaEmbed()"
        loading="lazy"
        title="Mapa"
      ></iframe
      ><br />
      <a mat-flat-button [href]="mapa()" target="_blank" rel="noopener"
        ><mat-icon>map</mat-icon>Abrir en Google Maps</a
      >
    </section>
  `,
})
export class Lugar {
  private san = inject(DomSanitizer);
  lugar = input.required<string>();
  barrio = input.required<string>();
  ciudad = input('');

  private direccion = computed(() =>
    [this.lugar(), this.barrio(), this.ciudad()].filter(Boolean).join(', '),
  );
  mapa = computed(
    () =>
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(this.direccion()),
  );
  mapaEmbed = computed(() =>
    this.san.bypassSecurityTrustResourceUrl(
      'https://maps.google.com/maps?q=' +
        encodeURIComponent(this.direccion()) +
        '&output=embed',
    ),
  );
}
