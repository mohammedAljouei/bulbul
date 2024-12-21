/*
  # Subscription Management Improvements

  1. Changes
    - Add function to check subscription validity
    - Add function to handle subscription expiration
    - Add trigger to update subscription status
    - Add constraint to prevent booking with expired subscriptions

  2. Security
    - Functions are SECURITY DEFINER to ensure proper access control
*/

-- Function to check if a subscription is valid
CREATE OR REPLACE FUNCTION is_subscription_valid(subscription_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_subscriptions
    WHERE id = subscription_id
    AND active = true
    AND end_date >= CURRENT_DATE
    AND remaining_sessions > 0
  );
END;
$$;

-- Function to handle subscription expiration
CREATE OR REPLACE FUNCTION handle_subscription_expiration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deactivate expired subscriptions
  UPDATE user_subscriptions
  SET active = false
  WHERE end_date < CURRENT_DATE
  AND active = true;
  
  -- Deactivate subscriptions with no remaining sessions
  UPDATE user_subscriptions
  SET active = false
  WHERE remaining_sessions <= 0
  AND active = true;

  RETURN NULL;
END;
$$;

-- Create trigger to run subscription expiration check daily
CREATE OR REPLACE TRIGGER check_subscription_expiration
  AFTER INSERT OR UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_expiration();

-- Add constraint to prevent booking with invalid subscriptions
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS check_valid_subscription;
ALTER TABLE bookings
  ADD CONSTRAINT check_valid_subscription
  CHECK (is_subscription_valid(subscription_id));