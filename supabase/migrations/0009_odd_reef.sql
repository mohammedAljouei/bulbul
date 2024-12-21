/*
  # Fix Booking RLS Policies

  1. Changes
    - Drop existing booking policies
    - Add new simplified policies for bookings table
    - Allow users to create bookings with pending status
    - Allow users to read their own bookings
  
  2. Security
    - Users can only create bookings for themselves
    - Users can only read their own bookings
    - Status must be 'pending' for new bookings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own pending bookings" ON bookings;

-- Create new policies
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending'
  );