import { Routes } from '@angular/router';
import { Invitacion } from './invitacion';
import { Generador } from './generador';

export const routes: Routes = [
  { path: '', component: Invitacion },
  { path: 'enlaces', component: Generador },
  { path: ':id', component: Invitacion },
  { path: '**', redirectTo: '' },
];
