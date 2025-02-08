/*
  # Add teachers and related tables

  1. New Tables
    - `teachers`
      - Basic teacher information
      - Profile details
      - Teaching preferences
    - `teacher_specialties`
      - Lookup table for specialties
    - `teacher_languages`
      - Lookup table for languages
    - `teacher_availability`
      - Weekly schedule and availability

  2. Security
    - Enable RLS on all tables
    - Public read access for active teachers
    - Admin-only write access
*/

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  rating numeric(3,2) DEFAULT 5.0,
  experience_years integer NOT NULL,
  image_url text,
  demo_video_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create specialties lookup table
CREATE TABLE IF NOT EXISTS teacher_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Create languages lookup table
CREATE TABLE IF NOT EXISTS teacher_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Create junction table for teacher specialties
CREATE TABLE IF NOT EXISTS teacher_specialty_links (
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  specialty_id uuid REFERENCES teacher_specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, specialty_id)
);

-- Create junction table for teacher languages
CREATE TABLE IF NOT EXISTS teacher_language_links (
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  language_id uuid REFERENCES teacher_languages(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, language_id)
);

-- Create teacher availability table
CREATE TABLE IF NOT EXISTS teacher_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_specialty_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_language_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active teachers"
  ON teachers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can read specialties"
  ON teacher_specialties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read languages"
  ON teacher_languages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read specialty links"
  ON teacher_specialty_links FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM teachers
    WHERE id = teacher_specialty_links.teacher_id
    AND is_active = true
  ));

CREATE POLICY "Anyone can read language links"
  ON teacher_language_links FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM teachers
    WHERE id = teacher_language_links.teacher_id
    AND is_active = true
  ));

CREATE POLICY "Anyone can read availability"
  ON teacher_availability FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM teachers
    WHERE id = teacher_availability.teacher_id
    AND is_active = true
  ));

-- Insert initial specialties
INSERT INTO teacher_specialties (name) VALUES
  ('محادثة'),
  ('قواعد'),
  ('كتابة'),
  ('نطق'),
  ('تحضير اختبارات'),
  ('مفردات'),
  ('قراءة'),
  ('استماع');

-- Insert initial languages
INSERT INTO teacher_languages (name) VALUES
  ('العربية'),
  ('الإنجليزية'),
  ('الفرنسية'),
  ('الإسبانية');

-- Insert sample teachers
INSERT INTO teachers (name, title, bio, experience_years, image_url, demo_video_url) VALUES
  (
    'سارة الأحمد',
    'مدرسة لغة إنجليزية محترفة',
    'متخصصة في تعليم اللغة الإنجليزية للمبتدئين والمتوسطين',
    8,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://www.youtube.com/watch?v=demo1'
  ),
  (
    'محمد العمري',
    'مدرس لغة إنجليزية متخصص',
    'خبير في تحضير الاختبارات الدولية وتطوير مهارات المحادثة',
    6,
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://www.youtube.com/watch?v=demo2'
  );

-- Link teachers with specialties
WITH t AS (SELECT id FROM teachers WHERE name = 'سارة الأحمد')
INSERT INTO teacher_specialty_links (teacher_id, specialty_id)
SELECT t.id, s.id
FROM t, teacher_specialties s
WHERE s.name IN ('محادثة', 'قواعد', 'كتابة');

WITH t AS (SELECT id FROM teachers WHERE name = 'محمد العمري')
INSERT INTO teacher_specialty_links (teacher_id, specialty_id)
SELECT t.id, s.id
FROM t, teacher_specialties s
WHERE s.name IN ('محادثة', 'نطق', 'تحضير اختبارات');

-- Link teachers with languages
WITH t AS (SELECT id FROM teachers WHERE name = 'سارة الأحمد')
INSERT INTO teacher_language_links (teacher_id, language_id)
SELECT t.id, l.id
FROM t, teacher_languages l
WHERE l.name IN ('العربية', 'الإنجليزية');

WITH t AS (SELECT id FROM teachers WHERE name = 'محمد العمري')
INSERT INTO teacher_language_links (teacher_id, language_id)
SELECT t.id, l.id
FROM t, teacher_languages l
WHERE l.name IN ('العربية', 'الإنجليزية');

-- Add sample availability
WITH t AS (SELECT id FROM teachers)
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time)
SELECT 
  t.id,
  d.day,
  '09:00'::time + (i * interval '2 hours'),
  '09:00'::time + ((i + 1) * interval '2 hours')
FROM t
CROSS JOIN generate_series(0, 6) AS d(day)
CROSS JOIN generate_series(0, 4) AS i;