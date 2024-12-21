/*
  # Seed test data

  1. New Data
    - Add test spots in Riyadh
    - Insert test data for locations where English sessions can be conducted
  
  2. Security
    - No changes to security policies (using existing ones)
*/

-- Insert test spots
INSERT INTO spots (name, google_maps_url, active) VALUES
  ('مقهى ورد - الرياض', 'https://maps.app.goo.gl/123', true),
  ('مكتبة جرير - العليا', 'https://maps.app.goo.gl/456', true),
  ('ستاربكس - النخيل مول', 'https://maps.app.goo.gl/789', true),
  ('مقهى دوز - حي الياسمين', 'https://maps.app.goo.gl/abc', true),
  ('مكتبة التربية - حي الملقا', 'https://maps.app.goo.gl/def', true);