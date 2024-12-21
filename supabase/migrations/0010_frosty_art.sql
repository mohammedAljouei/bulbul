/*
  # Fix Booking System

  1. Changes
    - Update booking policies to allow proper creation
    - Add policy for user_id validation
  
  2. Security
    - Ensure users can only create bookings for themselves
    - Maintain data integrity with subscription validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;

-- Create new policy
CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_subscriptions
      WHERE id = subscription_id
      AND user_id = auth.uid()
      AND active = true
    )
  );