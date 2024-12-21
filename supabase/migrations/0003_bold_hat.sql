/*
  # Create user subscriptions table

  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `package_id` (uuid) - References packages
      - `start_date` (date) - Subscription start date
      - `end_date` (date) - Subscription end date
      - `active` (boolean) - Whether subscription is currently active
      - `remaining_sessions` (integer) - Number of remaining sessions
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_subscriptions` table
    - Add policy for users to read their own subscriptions
*/

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

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);