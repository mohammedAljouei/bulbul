-- Add level to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level text CHECK (level IN ('beginner', 'intermediate', 'advanced'));

-- Create a function to update user level
CREATE OR REPLACE FUNCTION update_user_level(p_level text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET level = p_level,
      updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;