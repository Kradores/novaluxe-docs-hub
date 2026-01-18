create or replace function public.accept_user_invitation(
  invite_email text
)
returns void
language plpgsql
security definer
as $$
declare
  invite record;
  current_role text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select *
  into invite
  from public.user_invitations
  where email = invite_email
  for update;

  if not found then
    raise exception 'Invalid invitation';
  end if;

  if invite.accepted_at is not null then
    raise exception 'Invitation already used';
  end if;

  if invite.expires_at < now() then
    raise exception 'Invitation expired';
  end if;

  if invite.email <> (select email from auth.users where id = auth.uid()) then
    raise exception 'Email mismatch';
  end if;

  if exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
  ) then
    raise exception 'User already has a role';
  end if;

  insert into public.user_roles (user_id, role_id)
  values (auth.uid(), invite.role_id);

  update public.user_invitations
  set accepted_at = now()
  where email = invite_email;
end;
$$;

revoke all on function public.accept_user_invitation(text) from public;
grant execute on function public.accept_user_invitation(text) to authenticated;
