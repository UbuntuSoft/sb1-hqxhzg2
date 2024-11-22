-- Function to safely update product stock
create or replace function update_product_stock(p_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if the product exists and belongs to the authenticated user
  if not exists (
    select 1 from products 
    where id = p_id 
    and user_id = auth.uid()
  ) then
    raise exception 'Product not found or unauthorized';
  end if;

  -- Update the stock, ensuring it doesn't go below 0
  update products
  set 
    stock = greatest(stock + p_quantity, 0),
    updated_at = now()
  where id = p_id;
end;
$$;