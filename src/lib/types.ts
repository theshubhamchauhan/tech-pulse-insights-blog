
import type { Database } from "@/integrations/supabase/types";

// Type definitions for our database tables
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type ArticleTag = Database["public"]["Tables"]["article_tags"]["Row"];

// Simplified Profile type that doesn't require all DB fields
export interface SimpleProfile {
  id: string;
  name: string;
  avatar?: string | null;
  role?: string | null;
  bio?: string | null;
}

// Extended types for UI display
export interface ArticleWithRelations extends Omit<Article, "author_id" | "category_id"> {
  author: SimpleProfile;
  category: Category;
  tags: Tag[];
}

export interface CommentWithAuthor extends Comment {
  author: SimpleProfile;
  replies?: CommentWithAuthor[];
}

export interface Session {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
