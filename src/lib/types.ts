
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

// Author type for components that require avatar property
export interface Author {
  id: string;
  name: string;
  avatar: string;
  role?: string | null;
  bio?: string | null;
}

// Extended types for UI display
export interface ArticleWithRelations extends Omit<Article, "author_id" | "category_id"> {
  author: SimpleProfile;
  category: Category;
  tags: Tag[];
}

export interface CommentWithAuthor extends Omit<Comment, "author_id"> {
  author: SimpleProfile;
  replies?: CommentWithAuthor[];
}

export interface Session {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mapping functions to convert between types
export const mapToArticleProps = (article: ArticleWithRelations) => {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    coverImage: article.cover_image,
    category: article.category.name,
    author: {
      name: article.author.name,
      avatar: article.author.avatar || "",
    },
    date: new Date(article.created_at).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: article.read_time,
    slug: article.slug,
    featured: article.is_featured,
    isFavorite: false,
  };
};

export const ensureAuthor = (profile: SimpleProfile): Author => {
  return {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar || "",
    role: profile.role,
    bio: profile.bio,
  };
};
