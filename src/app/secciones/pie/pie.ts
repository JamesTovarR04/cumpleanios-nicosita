import { Component } from '@angular/core';

@Component({
  selector: 'app-pie',
  styles: `
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }
  `,
  template:
    '<p>Atentamente, <strong>James Tovar</strong>. Gracias por acompañarnos.</p>',
})
export class Pie {}
