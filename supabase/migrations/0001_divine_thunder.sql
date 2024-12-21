/*
  # Create packages table and initial data

  1. New Tables
    - `packages`
      - `id` (uuid, primary key)
      - `name` (text) - Package name in Arabic
      - `sessions_per_month` (integer) - Number of sessions
      - `price` (integer) - Price in SAR
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `packages` table
    - Add policy for authenticated users to read packages
*/

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sessions_per_month integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert initial packages
INSERT INTO packages (name, sessions_per_month, price) VALUES
  ('بلاتينية', 12, 900),
  ('ذهبية', 8, 700),
  ('فضية', 4, 400);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read packages"
  ON packages
  FOR SELECT
  TO authenticated
  USING (true);