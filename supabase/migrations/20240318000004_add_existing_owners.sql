-- Add existing users as owners in their own businesses
insert into team_members (business_id, user_id, role, status)
select 
  id as business_id,
  id as user_id,
  'owner' as role,
  'active' as status
from auth.users
where not exists (
  select 1 
  from team_members 
  where business_id = auth.users.id 
  and user_id = auth.users.id
);