create or replace function public.audit_delete()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    v_email text;
    v_name text;
begin
    select
        email,
        coalesce(
            raw_user_meta_data ->> 'full_name',
            raw_user_meta_data ->> 'name',
            raw_user_meta_data ->> 'display_name'
        )
    into
        v_email,
        v_name
    from auth.users
    where id = auth.uid();

    insert into public.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        performed_by,
        performed_by_email,
        performed_by_name
    )
    values (
        tg_table_name,
        old.id,
        'DELETE',
        to_jsonb(old),
        null,
        auth.uid(),
        v_email,
        v_name
    );

    return old;
end;
$$;