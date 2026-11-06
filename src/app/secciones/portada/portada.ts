import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Invitado } from '../../datos';

@Component({
  selector: 'app-portada',
  imports: [MatCardModule, MatChipsModule, MatDividerModule],
  styleUrl: './portada.scss',
  template: `
    <section class="hero">
      <img class="flor izq abajo" src="flores-c.png" alt="" /><img
        class="flor der arriba"
        src="flores-c.png"
        alt=""
      />
      <mat-card appearance="raised">
        <mat-card-content>
          @if (invitado(); as inv) {
            <p class="mat-title-medium">
              {{ inv.sexo === 'M' ? 'Querido' : 'Querida' }}
              <strong>{{ inv.nombre }}</strong>
            </p>
          }
          <p class="mat-label-large">
            {{
              invitado()?.sexo === 'M'
                ? 'ESTÁS INVITADO'
                : invitado()
                  ? 'ESTÁS INVITADA'
                  : 'ESTÁS INVITADO/A'
            }}
            A CELEBRAR EL <strong>CUMPLEAÑOS</strong> DE
          </p>
          <div class="script">{{ festejada() }}</div>
          <mat-divider />
          <p class="mensaje">
            Será un gran gusto contar con tu presencia para compartir este día
            tan especial.
          </p>
          @if (invitado()?.cupos; as c) {
            <mat-chip>{{
              c === 1 ? '1 cupo reservado' : c + ' cupos reservados'
            }}</mat-chip>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
})
export class Portada {
  festejada = input.required<string>();
  invitado = input<Invitado | null>(null);
}
