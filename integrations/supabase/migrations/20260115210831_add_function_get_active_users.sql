create or replace function public.get_active_users()
returns table (
  user_id uuid,
  email text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
SET search_path = public, auth
as $$
declare
  caller_role text;
begin
  -- Get caller role
  select r.name
  into caller_role
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = auth.uid()
  limit 1;

  -- Block regular users
  if caller_role is null or caller_role = 'user' then
    raise exception 'Not authorized';
  end if;

  -- Super admin sees all
  if caller_role = 'super_admin' then
    return query
    select
      u.id,
      u.email::text,
      r.name::text,
      u.created_at
    from auth.users u
    join public.user_roles ur on ur.user_id = u.id
    join public.roles r on r.id = ur.role_id
    order by u.created_at desc;
    return;
  end if;

  -- Admin sees admin + user
  if caller_role = 'admin' then
    return query
    select
      u.id,
      u.email::text,
      r.name::text,
      u.created_at
    from auth.users u
    join public.user_roles ur on ur.user_id = u.id
    join public.roles r on r.id = ur.role_id
    where r.name in ('admin', 'user')
    order by u.created_at desc;
    return;
  end if;
end;
$$;
