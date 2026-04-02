-- PocketFlow: categories + movements with RLS
-- Apply in Supabase SQL Editor or via supabase db push

create extension if not exists "pgcrypto";

-- Categories (owner-scoped)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  monthly_budget numeric(14, 2) check (monthly_budget is null or monthly_budget >= 0),
  created_at timestamptz not null default now()
);

create index categories_user_id_idx on public.categories (user_id);

-- Movements
create table public.movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  occurred_on date not null,
  description text,
  created_at timestamptz not null default now()
);

create index movements_user_id_idx on public.movements (user_id);
create index movements_user_occurred_idx on public.movements (user_id, occurred_on desc);

alter table public.categories enable row level security;
alter table public.movements enable row level security;

-- Categories: CRUD only own rows
create policy "categories_select_own"
  on public.categories for select
  using (user_id = auth.uid());

create policy "categories_insert_own"
  on public.categories for insert
  with check (user_id = auth.uid());

create policy "categories_update_own"
  on public.categories for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "categories_delete_own"
  on public.categories for delete
  using (user_id = auth.uid());

-- Movements: CRUD only own rows; category must belong to same user
create policy "movements_select_own"
  on public.movements for select
  using (user_id = auth.uid());

create policy "movements_insert_own"
  on public.movements for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.user_id = auth.uid()
    )
  );

create policy "movements_update_own"
  on public.movements for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.user_id = auth.uid()
    )
  );

create policy "movements_delete_own"
  on public.movements for delete
  using (user_id = auth.uid());
