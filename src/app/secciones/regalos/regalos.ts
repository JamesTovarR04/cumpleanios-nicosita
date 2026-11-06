import { Component, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RegaloDB, SupabaseService } from '../../supabase.service';
import { RegaloDialogo, textoCantidad } from './regalo-dialogo';

@Component({
  selector: 'app-regalos',
  imports: [MatListModule, MatIconModule, MatDividerModule, MatButtonModule],
  styleUrl: './regalos.scss',
  template: `
    <section>
      <img class="flor globo izq arriba" src="globo.png" alt="" /><img
        class="flor globo der abajo"
        src="globo.png"
        alt=""
      />
      <h1 class="titulos"><mat-icon>card_giftcard</mat-icon> Regalos</h1>
      <p>
        " Tu presencia es el mejor regalo, pero si deseas tener un detalle, aquí
        hay algunas ideas. "
      </p>
      @if (invitadoId()) {
        <p class="mat-label-large">Marca el regalo que llevarás para que no se repita.</p>
      }
      <mat-list class="regalos mx-auto">
        @for (r of regalos(); track r.id; let last = $last) {
          <mat-list-item [class.elegido]="r.elegido" (click)="abrir(r)">
            @if (r.imagen) {
              <img matListItemAvatar [src]="r.imagen" alt="" />
            } @else {
              <mat-icon matListItemIcon>redeem</mat-icon>
            }
            <span matListItemTitle>{{ r.titulo }}</span>
            <span matListItemLine>{{ texto(r.cantidad) }}{{ r.unico ? ' · Regalo único' : '' }}</span>
            <span matListItemMeta class="acciones">
              @if (r.link) {
                <a mat-icon-button [href]="r.link" target="_blank" rel="noopener" aria-label="Ver regalo" (click)="$event.stopPropagation()"
                  ><mat-icon>open_in_new</mat-icon></a
                >
              }
              @if (invitadoId()) {
                @if (r.elegido) {
                  <button mat-flat-button (click)="abrir(r, $event)"><mat-icon>check</mat-icon>Lo llevaré</button>
                } @else if (r.tomado) {
                  <button mat-stroked-button disabled (click)="$event.stopPropagation()">Reservado</button>
                } @else {
                  <button mat-stroked-button (click)="abrir(r, $event)">Elegir</button>
                }
              }
            </span>
          </mat-list-item>
          @if (!last) {
            <mat-divider />
          }
        }
      </mat-list>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </section>
  `,
})
export class Regalos {
  private db = inject(SupabaseService);
  private dialog = inject(MatDialog);
  texto = textoCantidad;
  invitadoId = input<string | null>(null);
  regalos = signal<RegaloDB[]>([]);
  error = signal('');

  constructor() {
    effect(() => {
      this.invitadoId();
      this.cargar();
    });
  }

  private async cargar() {
    try {
      this.regalos.set(await this.db.obtenerRegalos(this.invitadoId()));
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  abrir(r: RegaloDB, evento?: Event) {
    evento?.stopPropagation();
    this.dialog
      .open(RegaloDialogo, { data: { regalo: r, puedeElegir: !!this.invitadoId() }, width: '480px', maxWidth: '92vw' })
      .afterClosed()
      .subscribe((accion?: 'elegir' | 'quitar') => accion && this.alternar(r, accion));
  }

  private async alternar(r: RegaloDB, accion: 'elegir' | 'quitar') {
    const id = this.invitadoId();
    if (!id) return;
    this.error.set('');
    try {
      await (accion === 'quitar' ? this.db.quitarRegalo(id, r.id) : this.db.elegirRegalo(id, r.id));
    } catch (e) {
      this.error.set((e as Error).message);
    }
    await this.cargar();
  }
}
