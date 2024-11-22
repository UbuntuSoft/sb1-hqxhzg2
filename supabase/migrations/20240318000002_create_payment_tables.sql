-- Drop existing tables if they exist
drop table if exists payment_links;
drop table if exists payments;

-- Create payments table
create table payments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount decimal(10,2) not null,
  status text not null default 'pending',
  payment_method text not null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  reference text not null,
  merchant_id uuid references auth.users on delete cascade not null,
  checkout_request_id text,
  mpesa_receipt text,
  pesapal_merchant_reference text,
  pesapal_tracking_id text,
  order_id uuid references orders on delete set null
);

-- Create payment_links table
create table payment_links (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  payment_id uuid references payments on delete cascade not null,
  url text not null,
  expires_at timestamp with time zone not null,
  status text not null default 'active',
  unique(payment_id)
);

-- Enable RLS
alter table payments enable row level security;
alter table payment_links enable row level security;

-- Create policies for payments
create policy "Users can view their own payments."
  on payments for select
  using (auth.uid() = merchant_id);

create policy "Users can insert their own payments."
  on payments for insert
  with check (auth.uid() = merchant_id);

create policy "Users can update their own payments."
  on payments for update
  using (auth.uid() = merchant_id);

-- Create policies for payment links
create policy "Users can view payment links through payments."
  on payment_links for select
  using (
    exists (
      select 1 from payments
      where payments.id = payment_links.payment_id
      and payments.merchant_id = auth.uid()
    )
  );

create policy "Users can insert payment links through payments."
  on payment_links for insert
  with check (
    exists (
      select 1 from payments
      where payments.id = payment_links.payment_id
      and payments.merchant_id = auth.uid()
    )
  );

create policy "Users can update payment links through payments."
  on payment_links for update
  using (
    exists (
      select 1 from payments
      where payments.id = payment_links.payment_id
      and payments.merchant_id = auth.uid()
    )
  );

-- Create function to handle payment link expiry
create or replace function expire_payment_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update payment_links
  set status = 'expired'
  where expires_at < now()
  and status = 'active';
  return null;
end;
$$;

-- Create trigger for payment link expiry
create trigger expire_payment_links_trigger
  after insert or update on payment_links
  execute function expire_payment_links();

-- Create function to update payment status
create or replace function update_payment_status(
  p_payment_id uuid,
  p_status text,
  p_receipt text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if the payment exists and belongs to the authenticated user
  if not exists (
    select 1 from payments 
    where id = p_payment_id 
    and merchant_id = auth.uid()
  ) then
    raise exception 'Payment not found or unauthorized';
  end if;

  -- Update the payment status
  update payments
  set 
    status = p_status,
    mpesa_receipt = coalesce(p_receipt, mpesa_receipt),
    updated_at = now()
  where id = p_payment_id;

  -- If payment is completed, update the associated order
  if p_status = 'completed' then
    update orders
    set 
      payment_status = 'paid',
      status = 'confirmed',
      updated_at = now()
    where id = (
      select order_id 
      from payments 
      where id = p_payment_id
    );
  end if;
end;
$$;