create extension if not exists "pgcrypto";

create type user_role as enum ('customer', 'vendor', 'admin');
create type mockup_type as enum ('2d', '3d');
create type order_status as enum ('draft','quotation_requested','waiting_payment','paid_dp','design_review','waiting_approval','approved_for_production','assigned_to_vendor','in_production','quality_check','packing','shipped','completed','cancelled');

create table users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'customer',
  phone text,
  company_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  description text,
  base_price numeric(14,2) default 0,
  starting_price numeric(14,2) default 0,
  moq int default 1,
  production_time_min int default 1,
  production_time_max int default 7,
  has_2d_mockup boolean default false,
  has_3d_mockup boolean default false,
  image_url text,
  model_3d_url text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  sku text,
  material text,
  color text,
  size text,
  price_modifier numeric(14,2) default 0,
  stock_status text default 'available',
  created_at timestamptz default now()
);

create table product_knowledge (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  materials jsonb default '[]',
  print_methods jsonb default '[]',
  design_areas jsonb default '[]',
  file_requirements jsonb default '[]',
  pricing_notes jsonb default '[]',
  production_constraints jsonb default '[]',
  recommended_use_cases jsonb default '[]',
  warnings jsonb default '[]',
  faq jsonb default '[]',
  ai_context text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table pricing_rules (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  rule_name text not null,
  rule_type text not null,
  conditions jsonb default '{}',
  formula jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table design_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  canvas_json jsonb default '{}',
  preview_url text,
  width int default 1080,
  height int default 1350,
  unit text default 'px',
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table mockups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  design_project_id uuid references design_projects(id) on delete cascade,
  product_id uuid references products(id),
  mockup_type mockup_type not null,
  config jsonb default '{}',
  export_url text,
  created_at timestamptz default now()
);

create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  brand_name text,
  logos jsonb default '[]',
  colors jsonb default '[]',
  fonts jsonb default '[]',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  mime_type text,
  size bigint,
  related_project_id uuid references design_projects(id),
  related_order_id uuid,
  created_at timestamptz default now()
);

create table bulk_event_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  event_type text,
  event_name text,
  event_date date,
  location text,
  deadline date,
  participant_count int,
  budget_min numeric(14,2),
  budget_max numeric(14,2),
  selected_package text,
  size_breakdown jsonb default '{}',
  selected_products jsonb default '[]',
  uploaded_assets jsonb default '[]',
  status text default 'waiting_admin_review',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table quotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  order_id uuid,
  bulk_event_order_id uuid references bulk_event_orders(id),
  quotation_number text unique not null,
  items jsonb default '[]',
  subtotal numeric(14,2) default 0,
  discount numeric(14,2) default 0,
  rush_fee numeric(14,2) default 0,
  design_fee numeric(14,2) default 0,
  shipping_fee numeric(14,2) default 0,
  tax numeric(14,2) default 0,
  total numeric(14,2) default 0,
  terms text,
  valid_until date,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  quotation_id uuid references quotations(id),
  order_type text not null,
  status order_status default 'draft',
  total_amount numeric(14,2) default 0,
  payment_status text default 'unpaid',
  dp_amount numeric(14,2) default 0,
  remaining_amount numeric(14,2) default 0,
  production_deadline date,
  shipping_address jsonb default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table quotations add constraint quotations_order_fk foreign key (order_id) references orders(id);
alter table files add constraint files_order_fk foreign key (related_order_id) references orders(id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  design_project_id uuid references design_projects(id),
  mockup_id uuid references mockups(id),
  quantity int not null,
  unit_price numeric(14,2) default 0,
  subtotal numeric(14,2) default 0,
  specs jsonb default '{}',
  created_at timestamptz default now()
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  company_name text not null,
  location text,
  contact_phone text,
  production_methods jsonb default '[]',
  capabilities jsonb default '[]',
  capacity_per_day jsonb default '{}',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table vendor_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete cascade,
  assigned_items jsonb default '[]',
  status text default 'assigned',
  deadline date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table production_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  vendor_id uuid references vendors(id),
  status text not null,
  note text,
  proof_url text,
  created_by uuid references users_profile(id),
  created_at timestamptz default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  invoice_number text unique not null,
  amount numeric(14,2) default 0,
  status text default 'unpaid',
  due_date date,
  pdf_url text,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users_profile(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);

create or replace function is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from users_profile where id = auth.uid() and role = 'admin')
$$;

alter table users_profile enable row level security;
alter table design_projects enable row level security;
alter table mockups enable row level security;
alter table brand_kits enable row level security;
alter table files enable row level security;
alter table bulk_event_orders enable row level security;
alter table quotations enable row level security;
alter table orders enable row level security;
alter table vendor_assignments enable row level security;
alter table production_updates enable row level security;

create policy "profiles own or admin" on users_profile for all using (id = auth.uid() or is_admin());
create policy "products public read" on products for select using (true);
create policy "knowledge public read" on product_knowledge for select using (true);
create policy "customer own projects" on design_projects for all using (user_id = auth.uid() or is_admin());
create policy "customer own mockups" on mockups for all using (user_id = auth.uid() or is_admin());
create policy "customer own brand kits" on brand_kits for all using (user_id = auth.uid() or is_admin());
create policy "customer own files" on files for all using (user_id = auth.uid() or is_admin());
create policy "customer own bulk orders" on bulk_event_orders for all using (user_id = auth.uid() or is_admin());
create policy "customer own quotations" on quotations for all using (user_id = auth.uid() or is_admin());
create policy "customer own orders" on orders for all using (user_id = auth.uid() or is_admin());
create policy "vendor assignment visibility" on vendor_assignments for select using (
  is_admin() or exists (
    select 1 from vendors v where v.id = vendor_assignments.vendor_id and v.user_id = auth.uid()
  )
);
create policy "production updates visibility" on production_updates for select using (
  is_admin() or created_by = auth.uid() or exists (
    select 1 from vendors v where v.id = production_updates.vendor_id and v.user_id = auth.uid()
  )
);

-- Storage buckets to create in Supabase dashboard:
-- user-uploads, design-previews, mockup-exports, product-images, product-models,
-- production-files, brand-assets, quotation-pdfs.
