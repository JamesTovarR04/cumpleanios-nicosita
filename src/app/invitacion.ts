import { Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EVENTO, Invitado } from './datos';
import { BotonScroll } from './secciones/boton-scroll/boton-scroll';
import { Colores } from './secciones/colores/colores';
import { Confirmar } from './secciones/confirmar/confirmar';
import { Fecha } from './secciones/fecha/fecha';
import { Mensaje } from './secciones/mensaje/mensaje';
import { Cargando } from './secciones/cargando/cargando';
import { Musica } from './secciones/musica/musica';
import { Lugar } from './secciones/lugar/lugar';
import { Pie } from './secciones/pie/pie';
import { Portada } from './secciones/portada/portada';
import { Regalos } from './secciones/regalos/regalos';
import { RegaloDB, SupabaseService } from './supabase.service';

@Component({
  selector: 'app-invitacion',
  imports: [Cargando, Musica, BotonScroll, Mensaje, Portada, Fecha, Lugar, Regalos, Colores, Confirmar, Pie],
  template: `
    <app-cargando [visible]="cargando()" [listo]="listo()" [nombre]="evento.festejada" (abrir)="abrir()" />
    @if (!cargando()) {
      <app-portada [festejada]="evento.festejada" [invitado]="invitado()" />
      <app-fecha [fecha]="evento.fecha" />
      <app-lugar [lugar]="evento.lugar" [barrio]="evento.barrio" [ciudad]="evento.ciudad" />
      <app-regalos [invitadoId]="invitado()?.id ?? null" [inicial]="regalos()" [festejada]="evento.festejada" />
      <app-colores />
      @if (invitado()?.id) {
        <app-mensaje [invitadoId]="invitado()!.id!" [festejada]="evento.festejada" />
        <app-confirmar [invitado]="invitado()!" />
      }
      <app-pie />
      <app-boton-scroll />
    }
    <app-musica />
  `,
})
export class Invitacion {
  evento = EVENTO;
  invitado = signal<Invitado | null>(null);
  regalos = signal<RegaloDB[] | null>(null);
  cargando = signal(true);
  listo = signal(false);
  private musica = viewChild(Musica);

  // El clic del invitado permite iniciar la música (los navegadores bloquean el audio automático)
  abrir() {
    this.musica()?.iniciar();
    this.cargando.set(false);
  }

  private db = inject(SupabaseService);

  constructor() {
    const route = inject(ActivatedRoute);
    combineLatest([route.paramMap, route.queryParamMap]).subscribe(([p, q]) =>
      this.cargar(p.get('id'), q),
    );
  }

  // Admite /#/<uuid> (invitado guardado en Supabase) o ?nombre=Ana&sexo=F&cupos=2
  private async cargar(id: string | null, q: ParamMap) {
    const recursos = this.recursos();
    let inv: Invitado | null = id ? await this.db.obtenerInvitado(id) : null;
    const nombre = q.get('nombre');
    if (!inv && nombre) {
      inv = {
        nombre,
        sexo: q.get('sexo')?.toUpperCase() === 'M' ? 'M' : 'F',
        cupos: Math.max(1, Number(q.get('cupos')) || 1),
      };
    }
    this.invitado.set(inv);
    this.regalos.set(await this.db.obtenerRegalos(inv?.id ?? null).catch(() => []));
    await recursos;
    this.listo.set(true);
  }

  // Fuentes + imágenes decorativas + un mínimo de tiempo para que no parpadee (máximo 8 s de espera)
  private recursos() {
    const imagenes = ['flores-c.png', 'globo.png'].map(
      (src) => new Promise<void>((ok) => {
        const img = new Image();
        img.onload = img.onerror = () => ok();
        img.src = src;
      }),
    );
    const espera = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms));
    return Promise.race([Promise.all([document.fonts.ready, ...imagenes, espera(700)]), espera(8000)]);
  }
}