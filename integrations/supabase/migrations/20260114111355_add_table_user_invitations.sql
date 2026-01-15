create table if not exists public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role_id uuid references public.roles(id),
  token text not null unique,
  invited_by uuid references auth.users(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

create index on user_invitations (token);

alter table user_invitations enable row level security;
