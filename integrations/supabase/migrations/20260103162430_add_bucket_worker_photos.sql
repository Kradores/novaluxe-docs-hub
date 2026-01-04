insert into storage.buckets (
  id,
  name,
  public
)
values (
  'worker-photos',
  'worker-photos',
  false
)
on conflict (id) do nothing;
