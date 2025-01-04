export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  level?: UserLevel;
  created_at: string;
  updated_at: string;
}