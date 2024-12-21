/*
  # Complete Seed Data

  1. Test Data
    - Users (will be created through auth)
    - Packages (already seeded in first migration)
    - Spots (locations for in-person sessions)
    - User Subscriptions (sample subscriptions)
    - Bookings (sample session bookings)
*/

-- Insert test spots (if not already present)
INSERT INTO spots (name, google_maps_url, active)
SELECT * FROM (VALUES
  ('مقهى ورد - الرياض', 'https://maps.app.goo.gl/123', true),
  ('مكتبة جرير - العليا', 'https://maps.app.goo.gl/456', true),
  ('ستاربكس - النخيل مول', 'https://maps.app.goo.gl/789', true),
  ('مقهى دوز - حي الياسمين', 'https://maps.app.goo.gl/abc', true),
  ('مكتبة التربية - حي الملقا', 'https://maps.app.goo.gl/def', true)
) AS v(name, google_maps_url, active)
WHERE NOT EXISTS (
  SELECT 1 FROM spots WHERE name = v.name
);

-- Function to create test subscriptions and bookings for a user
CREATE OR REPLACE FUNCTION create_test_data_for_user(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_subscription_id uuid;
  v_spot_id uuid;
  v_package_id uuid;
BEGIN
  -- Get a random package
  SELECT id INTO v_package_id FROM packages ORDER BY RANDOM() LIMIT 1;
  
  -- Create subscription
  INSERT INTO user_subscriptions (
    user_id,
    package_id,
    start_date,
    end_date,
    active,
    remaining_sessions
  ) VALUES (
    user_uuid,
    v_package_id,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 month',
    true,
    8
  ) RETURNING id INTO v_subscription_id;

  -- Get a random spot
  SELECT id INTO v_spot_id FROM spots ORDER BY RANDOM() LIMIT 1;

  -- Create some test bookings
  INSERT INTO bookings (
    user_id,
    subscription_id,
    spot_id,
    session_date,
    session_time,
    is_online,
    status
  ) VALUES
  -- Past offline session
  (
    user_uuid,
    v_subscription_id,
    v_spot_id,
    CURRENT_DATE - INTERVAL '2 days',
    '14:00:00',
    false,
    'completed'
  ),
  -- Future offline session
  (
    user_uuid,
    v_subscription_id,
    v_spot_id,
    CURRENT_DATE + INTERVAL '2 days',
    '16:00:00',
    false,
    'confirmed'
  ),
  -- Future online session
  (
    user_uuid,
    v_subscription_id,
    NULL,
    CURRENT_DATE + INTERVAL '5 days',
    '18:00:00',
    true,
    'pending'
  );
END;
$$;

-- Note: To create test data for a specific user, run:
-- SELECT create_test_data_for_user('user-uuid-here');