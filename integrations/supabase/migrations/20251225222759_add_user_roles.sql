create table public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

alter table public.user_roles enable row level security;
