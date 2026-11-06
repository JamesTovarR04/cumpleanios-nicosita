import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fecha',
  imports: [MatCardModule, MatIconModule],
  styleUrl: './fecha.scss',
  template: `
    <section class="p-b-5">
      <h1 class="titulos"><mat-icon>event</mat-icon> Fecha</h1>
      <div class="fecha">
        <span>LUNES 9 DE NOVIEMBRE</span>
      </div>
      <div class="fecha">
        <strong>7:00 PM</strong>
      </div>
      <div class="cuenta">
        @for (c of cuenta(); track c.l) {
          <mat-card appearance="outlined">
            <div class="num">{{ c.v }}</div>
            <div class="mat-label-small">{{ c.l }}</div>
          </mat-card>
        }
      </div>
    </section>
  `,
})
export class Fecha implements OnInit, OnDestroy {
  fecha = input.required<Date>();
  private ahora = signal(Date.now());
  private timer?: ReturnType<typeof setInterval>;

  cuenta = computed(() => {
    const diff = Math.max(0, this.fecha().getTime() - this.ahora());
    return [
      { v: Math.floor(diff / 86400000), l: 'Días' },
      { v: Math.floor(diff / 3600000) % 24, l: 'Horas' },
      { v: Math.floor(diff / 60000) % 60, l: 'Min' },
      { v: Math.floor(diff / 1000) % 60, l: 'Seg' },
    ];
  });

  ngOnInit() {
    this.timer = setInterval(() => this.ahora.set(Date.now()), 1000);
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
