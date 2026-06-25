-- Web-Based 3D Editing & 3D Modeling Studio schema for Supabase/PostgreSQL

create extension if not exists "pgcrypto";

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  thumbnail_url text,
  unit text not null default 'm',
  scene_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.studio_projects(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_type text not null,
  asset_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  color text,
  texture_url text,
  roughness numeric default 0.5,
  metalness numeric default 0,
  opacity numeric default 1,
  price_per_unit numeric default 0,
  supplier_id uuid,
  is_default boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.studio_product_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_type text not null,
  model_url text,
  thumbnail_url text,
  printable_areas jsonb not null default '[]'::jsonb,
  base_price numeric default 0,
  is_public boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.studio_product_mockups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.studio_projects(id) on delete cascade,
  product_model_id uuid references public.studio_product_models(id),
  design_texture_url text,
  selected_area text,
  placement jsonb not null default '{}'::jsonb,
  material_id uuid references public.studio_materials(id),
  color text,
  size text,
  quantity integer default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.studio_projects(id) on delete set null,
  customer_id uuid,
  status text not null default 'draft',
  subtotal numeric default 0,
  margin numeric default 0,
  tax numeric default 0,
  total numeric default 0,
  quotation_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.studio_orders(id) on delete cascade,
  product_type text not null,
  material_id uuid references public.studio_materials(id),
  quantity integer not null default 1,
  print_area text,
  production_method text,
  finishing text,
  unit_price numeric default 0,
  total_price numeric default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.studio_vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_area text,
  capabilities jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.studio_vendor_prices (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.studio_vendors(id) on delete cascade,
  product_type text,
  material_id uuid references public.studio_materials(id),
  production_method text,
  price numeric not null default 0,
  min_quantity integer default 1,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.studio_projects enable row level security;
alter table public.studio_assets enable row level security;
alter table public.studio_materials enable row level security;
alter table public.studio_product_models enable row level security;
alter table public.studio_product_mockups enable row level security;
alter table public.studio_orders enable row level security;
alter table public.studio_order_items enable row level security;
alter table public.studio_vendors enable row level security;
alter table public.studio_vendor_prices enable row level security;

create policy "Users manage own studio projects" on public.studio_projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own studio assets" on public.studio_assets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read default or own materials" on public.studio_materials for select using (is_default = true or auth.uid() = user_id);
create policy "Users manage own custom materials" on public.studio_materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public product models readable" on public.studio_product_models for select using (is_public = true);
create policy "Users manage own orders" on public.studio_orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public vendors readable" on public.studio_vendors for select using (true);
create policy "Public vendor prices readable" on public.studio_vendor_prices for select using (true);

-- Create Supabase Storage buckets manually or through migration tooling:
-- studio-projects, studio-assets, studio-thumbnails, studio-product-models,
-- studio-textures, studio-exports, studio-order-files
