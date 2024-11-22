-- Create a function to update timestamps
create or replace function update_timestamps()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for all tables
create trigger update_profiles_timestamp
  before update on profiles
  for each row
  execute function update_timestamps();

create trigger update_products_timestamp
  before update on products
  for each row
  execute function update_timestamps();

create trigger update_orders_timestamp
  before update on orders
  for each row
  execute function update_timestamps();

create trigger update_expenses_timestamp
  before update on expenses
  for each row
  execute function update_timestamps();

create trigger update_suppliers_timestamp
  before update on suppliers
  for each row
  execute function update_timestamps();