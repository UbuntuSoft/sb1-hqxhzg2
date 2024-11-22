-- Function to verify M-Pesa payment and update order status
create or replace function verify_mpesa_payment(p_order_id uuid, p_mpesa_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if the order exists and belongs to the authenticated user
  if not exists (
    select 1 from orders 
    where id = p_order_id 
    and user_id = auth.uid()
  ) then
    raise exception 'Order not found or unauthorized';
  end if;

  -- Check if the M-Pesa code is already used
  if exists (
    select 1 from orders 
    where mpesa_code = p_mpesa_code 
    and id != p_order_id
  ) then
    raise exception 'M-Pesa code already used';
  end if;

  -- Update the order status
  update orders
  set 
    payment_status = 'paid',
    mpesa_code = p_mpesa_code,
    status = 'confirmed',
    updated_at = now()
  where id = p_order_id;
end;
$$;