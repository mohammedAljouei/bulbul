/*
  # Skip availability check for bookings

  1. Changes
    - Remove availability check from create_booking function
    - Simplify booking creation process
*/

-- Drop and recreate the create_booking function without availability check
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
  -- Get user_id and check remaining sessions
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

  -- Check if the user is the authenticated user
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Create booking without availability check
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

  -- Update remaining sessions
  UPDATE user_subscriptions
  SET remaining_sessions = remaining_sessions - 1
  WHERE id = p_subscription_id;

  RETURN v_booking_id;
END;
$$;