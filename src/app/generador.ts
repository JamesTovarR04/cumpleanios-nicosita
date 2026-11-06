import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Invitado } from './datos';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-generador',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatListModule],
  template: `
    <mat-card>
      <mat-card-header><mat-card-title>Invitados</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (!db.configurado) {
          <p>Configura <code>src/app/supabase.config.ts</code> con tu URL y anon key.</p>
        } @else if (!sesion()) {
          <mat-form-field><mat-label>Correo</mat-label><input matInput type="email" [(ngModel)]="email" /></mat-form-field>
          <mat-form-field><mat-label>Contraseña</mat-label><input matInput type="password" [(ngModel)]="password" (keyup.enter)="entrar()" /></mat-form-field>
        } @else {
          <mat-form-field><mat-label>Nombre</mat-label><input matInput [(ngModel)]="nombre" /></mat-form-field>
          <mat-form-field>
            <mat-label>Sexo</mat-label>
            <mat-select [(ngModel)]="sexo"><mat-option value="F">Femenino</mat-option><mat-option value="M">Masculino</mat-option></mat-select>
          </mat-form-field>
          <mat-form-field><mat-label>Cupos</mat-label><input matInput type="number" min="1" [(ngModel)]="cupos" /></mat-form-field>
          <mat-form-field><mat-label>Mensaje personal (opcional)</mat-label><textarea matInput rows="2" [(ngModel)]="mensaje"></textarea></mat-form-field>
          @if (ultimo()) {
            <p style="word-break: break-all">{{ ultimo() }}</p>
          }
          <mat-list>
            @for (i of invitados(); track i.id) {
              <mat-list-item>
                <span matListItemTitle>{{ i.nombre }} ({{ i.cupos }}){{ i.asiste ? ' ✔ asiste' : '' }}{{ i.visto ? ' 👁' : '' }}</span>
                <span matListItemLine>{{ enlace(i.id!) }}</span>
                <button matListItemMeta mat-button (click)="copiar(enlace(i.id!))">Copiar</button>
              </mat-list-item>
            }
          </mat-list>
        }
        @if (error()) {
          <p style="color: var(--mat-sys-error)">{{ error() }}</p>
        }
      </mat-card-content>
      @if (db.configurado) {
        <mat-card-actions>
          @if (!sesion()) {
            <button mat-flat-button (click)="entrar()">Entrar</button>
          } @else {
            <button mat-flat-button (click)="guardar()">Guardar y copiar enlace</button>
            <button mat-button (click)="salir()">Salir</button>
          }
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: `
    :host { display: block; padding: 2rem 1rem; }
    mat-card { max-width: 520px; margin: auto; padding: 1rem; }
    mat-form-field { display: block; }
  `,
})
export class Generador implements OnInit {
  db = inject(SupabaseService);
  sesion = signal(false);
  invitados = signal<(Invitado & { visto: boolean })[]>([]);
  ultimo = signal('');
  error = signal('');

  email = '';
  password = '';
  nombre = '';
  sexo: 'M' | 'F' = 'F';
  cupos = 1;
  mensaje = '';

  async ngOnInit() {
    if (this.db.configurado && (await this.db.haySesion())) {
      this.sesion.set(true);
      await this.cargar();
    }
  }

  enlace(id: string) {
    return `${location.href.split('#')[0].replace(/\/$/, '')}/#/${id}`;
  }

  private async intentar(accion: () => Promise<void>) {
    this.error.set('');
    try {
      await accion();
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  entrar() {
    return this.intentar(async () => {
      await this.db.entrar(this.email, this.password);
      this.sesion.set(true);
      await this.cargar();
    });
  }
  async salir() {
    await this.db.salir();
    this.sesion.set(false);
  }
  private async cargar() {
    this.invitados.set(await this.db.listarInvitados());
  }

  guardar() {
    return this.intentar(async () => {
      if (!this.nombre.trim()) throw new Error('Escribe el nombre del invitado');
      const id = await this.db.crearInvitado({
        nombre: this.nombre.trim(),
        sexo: this.sexo,
        cupos: Math.max(1, this.cupos || 1),
        mensaje: this.mensaje.trim() || null,
      });
      this.ultimo.set(this.enlace(id));
      await this.copiar(this.ultimo());
      this.nombre = '';
      this.mensaje = '';
      await this.cargar();
    });
  }

  copiar(texto: string) {
    return navigator.clipboard.writeText(texto);
  }
}
