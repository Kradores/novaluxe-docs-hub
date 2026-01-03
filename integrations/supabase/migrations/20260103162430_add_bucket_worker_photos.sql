insert into storage.buckets (
  id,
  name,
  public
)
values (
  'worker-photos',
  'worker-photos',
  true
)
on conflict (id) do nothing;
