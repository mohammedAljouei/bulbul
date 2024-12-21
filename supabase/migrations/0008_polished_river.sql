/*
  # Add subscription creation policy

  1. Security Changes
    - Add policy to allow users to create their own subscriptions
    - Users can only create subscriptions for themselves
*/

-- Allow users to create their own subscriptions
CREATE POLICY "Users can create own subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);