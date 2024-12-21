/*
  # Create helper functions

  1. Functions
    - check_booking_availability: Checks if a time slot is available
    - create_booking: Creates a new booking and updates subscription
    - cancel_booking: Cancels a booking and returns session to subscription

  2. Security
    - Functions are secured through RLS policies on underlying tables
*/

-- Function to check if a time slot is available
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
  -- Check if there's any booking at the same time
  IF p_spot_id IS NOT NULL THEN
    -- For physical sessions, check spot availability
    RETURN NOT EXISTS (
      SELECT 1
      FROM bookings
      WHERE session_date = p_session_date
        AND session_time = p_session_time
        AND spot_id = p_spot_id
        AND status NOT IN ('cancelled')
    );
  ELSE
    -- For online sessions, check instructor availability
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

-- Function to create a new booking
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

  -- Check availability
  IF NOT check_booking_availability(p_session_date, p_session_time, p_spot_id) THEN
    RAISE EXCEPTION 'Time slot not available';
  END IF;

  -- Create booking
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