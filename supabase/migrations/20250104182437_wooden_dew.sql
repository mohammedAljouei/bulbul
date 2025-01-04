/*
  # Initial Database Setup
  
  1. Tables Created:
    - packages
    - spots
    - user_subscriptions
    - bookings
    - profiles
  
  2. Functions Created:
    - check_booking_availability
    - create_booking
    - check_remaining_sessions
    - is_subscription_valid
    - handle_subscription_expiration
*/

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sessions_per_month integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert initial packages
INSERT INTO packages (name, sessions_per_month, price) VALUES
  ('بلاتينية', 12, 900),
  ('ذهبية', 8, 700),
  ('فضية', 4, 400);

-- Create spots table
CREATE TABLE IF NOT EXISTS spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  google_maps_url text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert test spots
INSERT INTO spots (name, google_maps_url, active) VALUES
  ('مقهى ورد - الرياض', 'https://maps.app.goo.gl/123', true),
  ('مكتبة جرير - العليا', 'https://maps.app.goo.gl/456', true),
  ('ستاربكس - النخيل مول', 'https://maps.app.goo.gl/789', true),
  ('مقهى دوز - حي الياسمين', 'https://maps.app.goo.gl/abc', true),
  ('مكتبة التربية - حي الملقا', 'https://maps.app.goo.gl/def', true);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  package_id uuid REFERENCES packages NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean DEFAULT true,
  remaining_sessions integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_id uuid REFERENCES user_subscriptions NOT NULL,
  spot_id uuid REFERENCES spots,
  session_date date NOT NULL,
  session_time time NOT NULL,
  is_online boolean NOT NULL,
  google_meet_link text,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT spot_or_online CHECK (
    (is_online = true AND spot_id IS NULL) OR
    (is_online = false AND spot_id IS NOT NULL)
  )
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Create helper functions
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_session_date date,
  p_session_time time,
  p_spot_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_spot_id IS NOT NULL THEN
    RETURN NOT EXISTS (
      SELECT 1
      FROM bookings
      WHERE session_date = p_session_date
        AND session_time = p_session_time
        AND spot_id = p_spot_id
        AND status NOT IN ('cancelled')
    );
  ELSE
    RETURN NOT EXISTS (
      SELECT 1
      FROM bookings
      WHERE session_date = p_session_date
        AND session_time = p_session_time
        AND is_online = true
        AND status NOT IN ('cancelled')
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION create_booking(
  p_subscription_id uuid,
  p_session_date date,
  p_session_time time,
  p_is_online boolean,
  p_spot_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_remaining_sessions integer;
  v_booking_id uuid;
BEGIN
  SELECT user_id, remaining_sessions
  INTO v_user_id, v_remaining_sessions
  FROM user_subscriptions
  WHERE id = p_subscription_id AND active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or inactive subscription';
  END IF;

  IF v_remaining_sessions <= 0 THEN
    RAISE EXCEPTION 'No remaining sessions';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO bookings (
    user_id,
    subscription_id,
    spot_id,
    session_date,
    session_time,
    is_online,
    status
  )
  VALUES (
    v_user_id,
    p_subscription_id,
    p_spot_id,
    p_session_date,
    p_session_time,
    p_is_online,
    'pending'
  )
  RETURNING id INTO v_booking_id;

  UPDATE user_subscriptions
  SET remaining_sessions = remaining_sessions - 1
  WHERE id = p_subscription_id;

  RETURN v_booking_id;
END;
$$;

-- Enable Row Level Security
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Anyone can read packages"
  ON packages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read active spots"
  ON spots FOR SELECT TO authenticated
  USING (active = true);

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON user_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_subscriptions
      WHERE id = subscription_id
      AND user_id = auth.uid()
      AND active = true
    )
  );

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);