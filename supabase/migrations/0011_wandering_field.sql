/*
  # Add Booking Validation

  1. Changes
    - Add function to validate remaining sessions
    - Add trigger to prevent booking if no sessions remain
  
  2. Security
    - Ensure users cannot exceed their session limit
    - Maintain subscription integrity
*/

-- Function to validate remaining sessions
CREATE OR REPLACE FUNCTION check_remaining_sessions(
  p_subscription_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_subscriptions
    WHERE id = p_subscription_id
    AND active = true
    AND remaining_sessions > 0
  );
END;
$$;

-- Add constraint to bookings table
ALTER TABLE bookings
  ADD CONSTRAINT check_remaining_sessions
  CHECK (check_remaining_sessions(subscription_id));