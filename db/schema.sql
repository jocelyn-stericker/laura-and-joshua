drop schema if exists app_public cascade;
drop schema if exists app_private cascade;
drop role if exists app_user;

create schema if not exists app_private;
create schema if not exists app_public;
create role app_user;
create role app_guest;
grant usage on schema app_public to app_user;
grant usage on schema app_public to app_guest;


-- Authentication and Families

create function app_public.current_family_id() returns int as $$
  select nullif(current_setting('jwt.claims.family_id', true), '')::int;
$$ language sql stable set search_path from current;

create function app_public.is_admin() returns boolean as $$
  select nullif(current_setting('jwt.claims.is_admin', true), '')::boolean;
$$ language sql stable set search_path from current;

create type app_public.jwt_token as (
  role text,
  exp integer,
  is_admin boolean,
  family_id integer
);

create table app_public.family (
  id serial primary key,
  postal_code text,
  name text,
  is_admin boolean default false
);

alter table app_public.family enable row level security;
grant select on table app_public.family to app_user;
grant select on table app_public.family to app_guest;
create policy select_mine on app_public.family for select using (id = app_public.current_family_id() OR app_public.is_admin());

create function app_public.current_family()
returns app_public.family as $$
  select * from app_public.family where family.id = app_public.current_family_id()
$$ language sql strict stable;

create function app_public.lookup_family(
  postal_code text
) returns setof app_public.family as $$
  select * from app_public.family where family.postal_code = lookup_family.postal_code
$$ language sql strict security definer stable;

create function app_public.authenticate(
  postal_code text,
  id integer
) returns app_public.jwt_token as $$
declare
  family app_public.family;
begin
  select f.* into family
    from app_public.family as f
    where f.postal_code = authenticate.postal_code
    and f.id = authenticate.id;

  if family.id is not null then
    return (
      'app_user',
      extract(epoch from now() + interval '7 days'),
      family.is_admin,
      family.id
    )::app_public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;


-- Guests

create table app_public.guest (
  id serial primary key,
  family_id integer,
  name text,
  email text,
  comment text,
  dietary_restrictions text,
  accepted_ceremony boolean,
  accepted_reception boolean,
  foreign key (family_id) references app_public.family(id)
);

grant select, update, insert, delete on table app_public.guest to app_user;
grant select on table app_public.guest to app_guest;
alter table app_public.guest enable row level security;
create policy select_mine on app_public.guest for select using (family_id = app_public.current_family_id() OR app_public.is_admin());
create policy update_mine on app_public.guest for update using (family_id = app_public.current_family_id() OR app_public.is_admin());
create policy insert_mine on app_public.guest for insert with check (family_id = app_public.current_family_id() OR app_public.is_admin());
create policy delete_mine on app_public.guest for delete using (family_id = app_public.current_family_id() OR app_public.is_admin());


-- Gift

create table app_public.gift (
  id serial primary key,
  name text,
  cost_cents integer,
  description text,
  link text,
  image text,
  max_count integer,
  category text
);

grant select, update, insert, delete on table app_public.gift to app_user;
grant select on table app_public.gift to app_guest;
alter table app_public.gift enable row level security;
create policy select_all on app_public.gift for select using (app_public.current_family_id() is not NULL);
create policy update_admin on app_public.gift for update using (app_public.is_admin());
create policy insert_admin on app_public.gift for insert with check (app_public.is_admin());
create policy delete_admin on app_public.gift for delete using (app_public.is_admin());


-- FamilyGift

create table app_public.family_gift (
  id serial primary key,
  family_id integer,
  gift_id integer,
  foreign key (family_id) references app_public.family(id),
  foreign key (gift_id) references app_public.gift(id)
);

grant select, insert, delete on table app_public.family_gift to app_user;
grant select on table app_public.family_gift to app_guest;
alter table app_public.family_gift enable row level security;
create policy select_all on app_public.family_gift for select using (app_public.current_family_id() is not NULL);
create policy insert_mine on app_public.family_gift for insert with check (family_id = app_public.current_family_id());
create policy delete_mind on app_public.family_gift for delete using (family_id = app_public.current_family_id());


-- Make sure we don't buy too many of a gift

-- Note: this won't stop people from changing the gift id of the thing they are buying.
create or replace function check_quantity()
returns trigger AS $$
declare
  has_too_much boolean;
begin
  select count(1) + 1 > max_count
    into has_too_much
    from app_public.family_gift
    left join app_public.gift
      on app_public.gift.id = app_public.family_gift.gift_id
    where app_public.gift.id = new.gift_id
    group by max_count;
  
  if (has_too_much) then
    raise exception 'too_many_gifts';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger check_quantity before insert on app_public.family_gift
  for each row execute procedure check_quantity();

-- Sequences

grant usage, select ON all sequences IN schema app_public TO app_user;