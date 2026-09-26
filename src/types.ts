export interface AIModel {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  isFree?: boolean;
  description: string;
  icon?: string;
}

export interface GeneratedProject {
  id: string;
  title: string;
  prompt: string;
  model: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'guest';
  credits: number;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type ActiveTab = 'preview' | 'code' | 'both';
