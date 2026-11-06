-- Ejecuta esto en Supabase: SQL Editor > New query
-- Funciona con tus tablas existentes: invitados, regalos, regalos_invitados.
-- Seguridad: el público NO lee las tablas directamente; solo usa estas funciones con el uuid del invitado.
-- 1) Solo usuarios autenticados (tú) administran las tablas
alter table
  public.invitados enable row level security;

alter table
  public.regalos enable row level security;

alter table
  public.regalos_invitados enable row level security;

drop policy if exists "admin invitados" on public.invitados;

drop policy if exists "admin regalos" on public.regalos;

drop policy if exists "admin regalos_invitados" on public.regalos_invitados;

create policy "admin invitados" on public.invitados for all to authenticated using (true) with check (true);

create policy "admin regalos" on public.regalos for all to authenticated using (true) with check (true);

create policy "admin regalos_invitados" on public.regalos_invitados for all to authenticated using (true) with check (true);

-- 2) Funciones públicas
drop function if exists public.obtener_invitado(text);

drop function if exists public.obtener_invitado(uuid);

create function public.obtener_invitado(p_id uuid) returns table (
  id uuid,
  nombre text,
  sexo text,
  cupos int,
  mensaje text,
  asiste boolean
) language plpgsql security definer
set
  search_path = public as $fn$ begin
update
  public.invitados
set
  visto = true
where
  invitados.id = p_id;

-- marca que abrió la invitación
return query
select
  i.id,
  i.nombre :: text,
  i.sexo :: text,
  i.cupos,
  i.mensaje,
  i.asiste
from
  public.invitados i
where
  i.id = p_id;

end $fn$;

drop function if exists public.obtener_regalos(uuid);

create function public.obtener_regalos(p_invitado uuid default null) returns table (
  id bigint,
  imagen text,
  titulo text,
  detalle text,
  unico boolean,
  link text,
  elegido boolean,
  tomado boolean,
  cantidad int
) language sql stable security definer
set
  search_path = public as $fn$
select
  r.id,
  r.imagen,
  r.titulo :: text,
  r.detalle :: text,
  coalesce(r.unico, false),
  r.link,
  exists (
    select
      1
    from
      public.regalos_invitados ri
    where
      ri.id_regalo = r.id
      and ri.id_invitado = p_invitado
  ),
  coalesce(r.unico, false)
  and exists (
    select
      1
    from
      public.regalos_invitados ri
    where
      ri.id_regalo = r.id
      and ri.id_invitado is distinct
    from
      p_invitado
  ),
  (
    select
      count(*) :: int
    from
      public.regalos_invitados ri
    where
      ri.id_regalo = r.id
  )
from
  public.regalos r
order by
  r.id;

$fn$;

drop function if exists public.elegir_regalo(uuid, bigint);

create function public.elegir_regalo(p_invitado uuid, p_regalo bigint) returns void language plpgsql security definer
set
  search_path = public as $fn$ begin if not exists (
    select
      1
    from
      public.invitados
    where
      id = p_invitado
  ) then raise exception 'Invitado no valido';

end if;

if exists (
  select
    1
  from
    public.regalos r
    join public.regalos_invitados ri on ri.id_regalo = r.id
  where
    r.id = p_regalo
    and coalesce(r.unico, false)
    and ri.id_invitado <> p_invitado
) then raise exception 'Ese regalo ya fue reservado por otro invitado';

end if;

if not exists (
  select
    1
  from
    public.regalos_invitados
  where
    id_regalo = p_regalo
    and id_invitado = p_invitado
) then
insert into
  public.regalos_invitados (id_regalo, id_invitado)
values
  (p_regalo, p_invitado);

end if;

end $fn$;

drop function if exists public.quitar_regalo(uuid, bigint);

create function public.quitar_regalo(p_invitado uuid, p_regalo bigint) returns void language sql security definer
set
  search_path = public as $fn$
delete from
  public.regalos_invitados
where
  id_regalo = p_regalo
  and id_invitado = p_invitado;

$fn$;

drop function if exists public.confirmar_asistencia(uuid, boolean);

create function public.confirmar_asistencia(p_id uuid, p_asiste boolean) returns void language sql security definer
set
  search_path = public as $fn$
update
  public.invitados
set
  asiste = p_asiste
where
  id = p_id;

$fn$;

grant execute on function public.obtener_invitado(uuid),
public.obtener_regalos(uuid),
public.elegir_regalo(uuid, bigint),
public.quitar_regalo(uuid, bigint),
public.confirmar_asistencia(uuid, boolean) to anon,
authenticated;

-- 3) Limpieza de la funcion de diagnostico
drop function if exists public.ver_esquema();