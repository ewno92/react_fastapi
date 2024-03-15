export interface Comment {
  id: number;
  parent_id: number | null;
  display_name: string;
  text: string;
  created_at: string;
  child: Comment[];
}

export interface Post {
  post_url: string;
  title: string;
  created_at: Date;
  num_hugs: number;
  patient_description: string;
  num_comments: number;
  assessment?: string | null;
  question?: string;
}

export interface PartialPost {
  assessment?: string;
  question?: string;
}

export interface ExpandedPost {
  post_url: string;
  title: string;
  created_at: Date;
  num_hugs: number;
  patient_description: string;
  num_comments: number;
  question: string;
  assessment: string;
}
