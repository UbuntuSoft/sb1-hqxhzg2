-- Drop existing tables if they exist
DROP TABLE IF EXISTS team_invites CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;

-- Create team_members table
CREATE TABLE team_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  business_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(business_id, user_id)
);

-- Create team_invites table
CREATE TABLE team_invites (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  business_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  UNIQUE(business_id, email)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Business owners can view their team members"
  ON team_members FOR SELECT
  USING (auth.uid() = business_id);

CREATE POLICY "Team members can view their own team"
  ON team_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can manage team members"
  ON team_members FOR ALL
  USING (auth.uid() = business_id)
  WITH CHECK (auth.uid() = business_id);

-- Create policies for team_invites
CREATE POLICY "Business owners can view their invites"
  ON team_invites FOR SELECT
  USING (auth.uid() = business_id);

CREATE POLICY "Users can view invites sent to their email"
  ON team_invites FOR SELECT
  USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage invites"
  ON team_invites FOR ALL
  USING (auth.uid() = business_id)
  WITH CHECK (auth.uid() = business_id);

-- Create function to handle team member creation from invite
CREATE OR REPLACE FUNCTION accept_team_invite(invite_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite team_invites;
BEGIN
  -- Get and validate invite
  SELECT * INTO v_invite
  FROM team_invites
  WHERE token = invite_token
  AND status = 'pending'
  AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;

  -- Create team member
  INSERT INTO team_members (
    business_id,
    user_id,
    role,
    status
  ) VALUES (
    v_invite.business_id,
    auth.uid(),
    v_invite.role,
    'active'
  );

  -- Update invite status
  UPDATE team_invites
  SET 
    status = 'accepted',
    updated_at = now()
  WHERE token = invite_token;
END;
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user_team()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create team member record for the business owner
  INSERT INTO team_members (
    business_id,
    user_id,
    role,
    status
  ) VALUES (
    NEW.id,  -- The business owner's user ID
    NEW.id,  -- They are both the business and the user
    'owner',
    'active'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created_team ON auth.users;
CREATE TRIGGER on_auth_user_created_team
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user_team();