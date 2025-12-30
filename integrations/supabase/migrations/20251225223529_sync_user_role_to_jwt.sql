-- Function to sync role into auth.users.app_metadata
create or replace function public.sync_user_role()
returns trigger
language plpgsql
security definer
as $$
declare
  role_name text;
begin
  select r.name
  into role_name
  from public.roles r
  where r.id = new.role_id;

  update auth.users
  set app_metadata = coalesce(app_metadata, '{}'::jsonb)
    || jsonb_build_object('role', role_name)
  where id = new.user_id;

  return new;
end;
$$;

-- Trigger
create trigger sync_user_role_trigger
after insert or update on public.user_roles
for each row
execute function public.sync_user_role();
