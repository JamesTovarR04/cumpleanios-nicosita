import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-mensaje',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  styles: `
    :host {
      display: block;
    }
    form {
      max-width: 520px;
      margin: 1rem auto 0;
    }
    mat-form-field {
      width: 100%;
    }
    .ok {
      color: var(--mat-sys-primary);
    }
    .error {
      color: var(--mat-sys-error);
    }
  `,
  template: `
    <section class="p-b-5">
      <h1 class="titulos"><mat-icon>mail</mat-icon> Escribe un mensaje</h1>
      <p>" Escríbele unas palabras, las leerá con cariño. "</p>
      <form (ngSubmit)="enviar()">
        <mat-form-field appearance="outline">
          <mat-label>Tu mensaje</mat-label>
          <textarea
            matInput
            name="mensaje"
            rows="5"
            maxlength="500"
            [(ngModel)]="texto"
            placeholder="Feliz cumpleaños..."
          ></textarea>
          <mat-hint align="end">{{ texto.length }}/500</mat-hint>
        </mat-form-field>
        <button
          mat-flat-button
          type="submit"
          [disabled]="enviando() || !texto.trim()"
        >
          <mat-icon>send</mat-icon
          >{{ guardado() ? 'Actualizar mensaje' : 'Enviar mensaje' }}
        </button>
        @if (estado()) {
          <p class="ok">{{ estado() }}</p>
        }
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
      </form>
    </section>
  `,
})
export class Mensaje implements OnInit {
  private db = inject(SupabaseService);
  invitadoId = input.required<string>();
  festejada = input.required<string>();

  texto = '';
  guardado = signal(false);
  enviando = signal(false);
  estado = signal('');
  error = signal('');

  async ngOnInit() {
    try {
      this.texto = await this.db.obtenerMensaje(this.invitadoId());
      this.guardado.set(!!this.texto);
    } catch {
      // sin mensaje previo
    }
  }

  async enviar() {
    this.estado.set('');
    this.error.set('');
    this.enviando.set(true);
    try {
      await this.db.enviarMensaje(this.invitadoId(), this.texto);
      this.guardado.set(true);
      this.estado.set('¡Mensaje enviado! Gracias 💜');
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.enviando.set(false);
    }
  }
}
