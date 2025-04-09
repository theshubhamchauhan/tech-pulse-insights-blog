
import type { Database } from "@/integrations/supabase/types";

// Type definitions for our database tables
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type ArticleTag = Database["public"]["Tables"]["article_tags"]["Row"];

// Extended types for UI display
export interface ArticleWithRelations extends Omit<Article, "author_id" | "category_id"> {
  author: Profile;
  category: Category;
  tags: Tag[];
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
  replies?: CommentWithAuthor[];
}

export interface Session {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
