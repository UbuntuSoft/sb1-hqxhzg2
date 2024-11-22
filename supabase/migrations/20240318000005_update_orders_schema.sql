-- Update orders table with new fields
alter table orders 
  add column if not exists delivery_mode text check (delivery_mode in ('boda', 'pickup')),
  add column if not exists delivery_notes text,
  alter column status type text using status::text,
  alter column status set default 'pending',
  add constraint valid_status check (
    status in ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')
  ),
  alter column payment_status type text using payment_status::text,
  alter column payment_status set default 'pending',
  add constraint valid_payment_status check (
    payment_status in ('pending', 'paid', 'refunded', 'cancelled')
  ),
  alter column payment_method type text using payment_method::text,
  add constraint valid_payment_method check (
    payment_method in ('mpesa_stk', 'mpesa_link', 'mpesa_manual', 'card', 'cash')
  );