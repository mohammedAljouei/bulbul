/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `subscription_id` (uuid) - References user_subscriptions
      - `spot_id` (uuid, nullable) - References spots (null for online sessions)
      - `session_date` (date) - Date of the session
      - `session_time` (time) - Time of the session
      - `is_online` (boolean) - Whether session is online
      - `google_meet_link` (text, nullable) - Google Meet link for online sessions
      - `status` (text) - Status of booking (pending, confirmed, completed, cancelled)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for users to manage their bookings
*/

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

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending'
  );

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    status = 'pending'
  )
  WITH CHECK (
    auth.uid() = user_id AND
    status IN ('pending', 'cancelled')
  );