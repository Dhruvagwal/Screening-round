-- Step 1: Create a trigger function that auto-updates 'updated_at'
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create your table
CREATE TABLE IF NOT EXISTS public.user_token (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  connected_account_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Add the trigger
CREATE TRIGGER update_user_token_timestamp
BEFORE UPDATE ON user_token
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
