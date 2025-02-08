import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  experience_years: number;
  image_url: string;
  demo_video_url: string;
  specialties: string[];
  languages: string[];
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select(`
            *,
            teacher_specialty_links(
              teacher_specialties(name)
            ),
            teacher_language_links(
              teacher_languages(name)
            )
          `)
          .eq('is_active', true)
          .order('rating', { ascending: false });

        if (error) throw error;

        const formattedTeachers = data.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          title: teacher.title,
          bio: teacher.bio,
          rating: teacher.rating,
          experience_years: teacher.experience_years,
          image_url: teacher.image_url,
          demo_video_url: teacher.demo_video_url,
          specialties: teacher.teacher_specialty_links.map(
            (link: any) => link.teacher_specialties.name
          ),
          languages: teacher.teacher_language_links.map(
            (link: any) => link.teacher_languages.name
          )
        }));

        setTeachers(formattedTeachers);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(err instanceof Error ? err.message : 'Error fetching teachers');
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  return { teachers, loading, error };
}