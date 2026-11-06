import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Invitado } from './datos';
import { SUPABASE } from './supabase.config';

export interface RegaloDB {
  id: number;
  imagen: string;
  titulo: string;
  detalle: string;
  unico: boolean;
  link: string | null;
  elegido: boolean; // lo eligió este invitado
  tomado: boolean; // regalo único ya elegido por otro invitado
  cantidad: number; // cuántas personas lo llevarán
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client = createClient(SUPABASE.url, SUPABASE.anonKey);

  get configurado() {
    return !SUPABASE.url.includes('TU-PROYECTO') && !SUPABASE.anonKey.startsWith('TU-');
  }

  private async rpc<T>(fn: string, args: object): Promise<T> {
    const { data, error } = await this.client.rpc(fn, args);
    if (error) throw new Error(error.message);
    return data as T;
  }

  // ===== Público (por uuid del invitado) =====
  async obtenerInvitado(id: string): Promise<Invitado | null> {
    if (!this.configurado || !UUID.test(id)) return null;
    try {
      const data = await this.rpc<Invitado[]>('obtener_invitado', { p_id: id });
      return data[0] ?? null;
    } catch {
      return null;
    }
  }

  async obtenerRegalos(invitadoId: string | null): Promise<RegaloDB[]> {
    if (!this.configurado) return [];
    return this.rpc<RegaloDB[]>('obtener_regalos', { p_invitado: invitadoId });
  }
  elegirRegalo(invitadoId: string, regaloId: number) {
    return this.rpc<void>('elegir_regalo', { p_invitado: invitadoId, p_regalo: regaloId });
  }
  quitarRegalo(invitadoId: string, regaloId: number) {
    return this.rpc<void>('quitar_regalo', { p_invitado: invitadoId, p_regalo: regaloId });
  }
  confirmarAsistencia(invitadoId: string, asiste: boolean) {
    return this.rpc<void>('confirmar_asistencia', { p_id: invitadoId, p_asiste: asiste });
  }

  async obtenerMensaje(invitadoId: string): Promise<string> {
    return (await this.rpc<string | null>('obtener_mensaje', { p_invitado: invitadoId })) ?? '';
  }
  enviarMensaje(invitadoId: string, mensaje: string) {
    return this.rpc<void>('enviar_mensaje', { p_invitado: invitadoId, p_mensaje: mensaje });
  }

  // ===== Administrador (requiere sesión) =====
  async crearInvitado(inv: Pick<Invitado, 'nombre' | 'sexo' | 'cupos' | 'mensaje'>): Promise<string> {
    const { data, error } = await this.client.from('invitados').insert(inv).select('id').single();
    if (error) throw new Error(error.message);
    return data.id as string;
  }

  async listarInvitados(): Promise<(Invitado & { visto: boolean })[]> {
    const { data, error } = await this.client.from('invitados').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as (Invitado & { visto: boolean })[];
  }

  async haySesion() {
    const { data } = await this.client.auth.getSession();
    return !!data.session;
  }
  async entrar(email: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }
  salir() {
    return this.client.auth.signOut();
  }
}
