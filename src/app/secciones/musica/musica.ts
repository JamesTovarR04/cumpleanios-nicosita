import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-musica',
  imports: [MatButtonModule, MatIconModule],
  styleUrl: './musica.scss',
  template: `
    <button mat-mini-fab [attr.aria-label]="sonando() ? 'Pausar música' : 'Reproducir música'" (click)="alternar()">
      <mat-icon>{{ sonando() ? 'music_note' : 'music_off' }}</mat-icon>
    </button>
  `,
})
export class Musica implements OnInit, OnDestroy {
  private audio = new Audio('musica.mp3');
  private pausadoPorUsuario = false;
  private eventos = ['pointerdown', 'click', 'touchstart', 'keydown'];
  private alInteractuar = () => this.reproducir();
  sonando = signal(false);

  constructor() {
    this.audio.loop = true;
    this.audio.volume = 0.6;
    this.audio.addEventListener('play', () => this.sonando.set(true));
    this.audio.addEventListener('pause', () => this.sonando.set(false));
  }

  ngOnInit() {
    // Los navegadores bloquean el audio automático: se intenta al cargar y, si falla,
    // arranca con la primera interacción (clic, toque o tecla) del invitado.
    this.eventos.forEach((e) => document.addEventListener(e, this.alInteractuar));
    this.reproducir();
  }

  ngOnDestroy() {
    this.audio.pause();
    this.quitarEventos();
  }

  private quitarEventos() {
    this.eventos.forEach((e) => document.removeEventListener(e, this.alInteractuar));
  }

  private reproducir() {
    if (this.pausadoPorUsuario) return;
    this.audio.play().then(() => this.quitarEventos()).catch(() => {});
  }

  /** Se llama desde un clic del usuario (botón "Abrir invitación"), donde el navegador sí permite audio. */
  iniciar() {
    this.pausadoPorUsuario = false;
    this.audio.play().then(() => this.quitarEventos()).catch(() => {});
  }

  alternar() {
    if (this.audio.paused) {
      this.pausadoPorUsuario = false;
      this.audio.play().catch(() => {});
    } else {
      this.pausadoPorUsuario = true;
      this.audio.pause();
    }
  }
}