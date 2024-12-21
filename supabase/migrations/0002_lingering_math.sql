/*
  # Create spots table for physical locations

  1. New Tables
    - `spots`
      - `id` (uuid, primary key)
      - `name` (text) - Location name in Arabic
      - `google_maps_url` (text) - Google Maps link
      - `active` (boolean) - Whether spot is currently available
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `spots` table
    - Add policy for authenticated users to read active spots
*/

CREATE TABLE IF NOT EXISTS spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  google_maps_url text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active spots"
  ON spots
  FOR SELECT
  TO authenticated
  USING (active = true);