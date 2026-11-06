import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EVENTO, INVITADOS, Invitado } from './datos';
import { Colores } from './secciones/colores/colores';
import { Confirmar } from './secciones/confirmar/confirmar';
import { Fecha } from './secciones/fecha/fecha';
import { Lugar } from './secciones/lugar/lugar';
import { Pie } from './secciones/pie/pie';
import { Portada } from './secciones/portada/portada';
import { Regalos } from './secciones/regalos/regalos';

@Component({
  selector: 'app-invitacion',
  imports: [Portada, Fecha, Lugar, Regalos, Colores, Confirmar, Pie],
  template: `
    <app-portada [festejada]="evento.festejada" [invitado]="invitado()" />
    <app-fecha [fecha]="evento.fecha" />
    <app-lugar
      [lugar]="evento.lugar"
      [barrio]="evento.barrio"
      [ciudad]="evento.ciudad"
    />
    <app-regalos />
    <app-colores />
    @if (evento.whatsapp) {
      <app-confirmar [whatsapp]="evento.whatsapp" [invitado]="invitado()" />
    }
    <app-pie />
  `,
})
export class Invitacion {
  evento = EVENTO;
  invitado = signal<Invitado | null>(null);

  constructor() {
    const route = inject(ActivatedRoute);
    combineLatest([route.paramMap, route.queryParamMap]).subscribe(([p, q]) =>
      this.cargar(p.get('id'), q),
    );
  }

  // Admite /#/ana (definido en datos.ts) o ?nombre=Ana&sexo=F&cupos=2
  private cargar(id: string | null, q: ParamMap) {
    let inv: Invitado | null = id
      ? (INVITADOS[id.toLowerCase()] ?? null)
      : null;
    const nombre = q.get('nombre');
    if (!inv && nombre) {
      inv = {
        nombre,
        sexo: q.get('sexo')?.toUpperCase() === 'M' ? 'M' : 'F',
        cupos: Math.max(1, Number(q.get('cupos')) || 1),
      };
    }
    this.invitado.set(inv);
  }
}
