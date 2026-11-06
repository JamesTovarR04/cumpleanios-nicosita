import { Component, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RegaloDB, SupabaseService } from '../../supabase.service';
import { RegaloDialogo, textoCantidad } from './regalo-dialogo';

@Component({
  selector: 'app-regalos',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
  ],
  styleUrl: './regalos.scss',
  template: `
    <section>
      <img class="flor globo izq arriba" src="globo.png" alt="" /><img
        class="flor globo der abajo"
        src="globo.png"
        alt=""
      />
      <h1 class="titulos"><mat-icon>card_giftcard</mat-icon> Regalos</h1>
      <mat-card class="m-b-3">
        <mat-card-content>
          <p class="mensaje m-t-2">
            " Tu presencia es el mejor regalo, pero si deseas tener un detalle,
            aquí hay algunas ideas. "
          </p>
        </mat-card-content>
      </mat-card>
      @if (invitadoId()) {
        <p class="mat-label-large">
          Marca el regalo que quieras llevarpara que no se repita.
        </p>
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
            <span matListItemLine
              >{{ texto(r.cantidad)
              }}{{ r.unico ? ' · Regalo único' : '' }}</span
            >
            <span matListItemMeta class="acciones">
              @if (r.link) {
                <a
                  mat-icon-button
                  [href]="r.link"
                  target="_blank"
                  rel="noopener"
                  aria-label="Ver regalo"
                  (click)="$event.stopPropagation()"
                  ><mat-icon>open_in_new</mat-icon></a
                >
              }
              @if (invitadoId()) {
                @if (r.elegido) {
                  <button mat-flat-button (click)="abrir(r, $event)">
                    <mat-icon>check</mat-icon>Lo llevaré
                  </button>
                } @else if (r.tomado) {
                  <button
                    mat-stroked-button
                    disabled
                    (click)="$event.stopPropagation()"
                  >
                    Reservado
                  </button>
                } @else {
                  <button mat-stroked-button (click)="abrir(r, $event)">
                    Elegir
                  </button>
                }
              }
            </span>
          </mat-list-item>
          @if (!last) {
            <mat-divider />
          }
        }
      </mat-list>
      <p class="nota mx-auto m-b-5">
        <mat-icon>favorite</mat-icon>
        Tu regalo también puede ser libre. Esta lista es solo una sugerencia,
        pensada según algunos gustos de Nicolth.
      </p>
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
  inicial = input<RegaloDB[] | null>(null); // datos ya consultados (pantalla de carga)
  festejada = input('la cumpleañera');
  regalos = signal<RegaloDB[]>([]);
  error = signal('');

  constructor() {
    effect(() => {
      this.invitadoId();
      const ini = this.inicial();
      if (ini) this.regalos.set(ini);
      else this.cargar();
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
      .open(RegaloDialogo, {
        data: { regalo: r, puedeElegir: !!this.invitadoId() },
        width: '480px',
        maxWidth: '92vw',
      })
      .afterClosed()
      .subscribe(
        (accion?: 'elegir' | 'quitar') => accion && this.alternar(r, accion),
      );
  }

  private async alternar(r: RegaloDB, accion: 'elegir' | 'quitar') {
    const id = this.invitadoId();
    if (!id) return;
    this.error.set('');
    try {
      await (accion === 'quitar'
        ? this.db.quitarRegalo(id, r.id)
        : this.db.elegirRegalo(id, r.id));
    } catch (e) {
      this.error.set((e as Error).message);
    }
    await this.cargar();
  }
}
