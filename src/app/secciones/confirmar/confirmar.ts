import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Invitado } from '../../datos';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-confirmar',
  imports: [MatButtonModule, MatIconModule],
  styles: ':host { display: block; } .error { color: var(--mat-sys-error); }',
  template: `
    <section class="alt p-b-5">
      <h3 class="mat-headline-medium">¿Nos acompañas?</h3>
      @if (asiste()) {
        <p class="mat-title-medium">¡Gracias por confirmar, {{ invitado().nombre }}! Te esperamos.</p>
        <button mat-stroked-button (click)="responder(false)">Ya no podré asistir</button>
      } @else {
        <button mat-flat-button (click)="responder(true)"><mat-icon>check_circle</mat-icon>Confirmar asistencia</button>
      }
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </section>
  `,
})
export class Confirmar {
  private db = inject(SupabaseService);
  invitado = input.required<Invitado>();
  private local = signal<boolean | null>(null);
  error = signal('');

  asiste = () => this.local() ?? !!this.invitado().asiste;

  async responder(valor: boolean) {
    this.error.set('');
    try {
      await this.db.confirmarAsistencia(this.invitado().id!, valor);
      this.local.set(valor);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
