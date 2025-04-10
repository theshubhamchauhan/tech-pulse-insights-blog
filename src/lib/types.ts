
import type { Database } from "@/integrations/supabase/types";

// Type definitions for our database tables
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  image_url?: string | null;
};
export type Tag = Database["public"]["Tables"]["tags"]["Row"];

// Base types from database schema
export type BaseArticle = Database["public"]["Tables"]["articles"]["Row"];

// Extended article type with SEO fields
export type Article = BaseArticle;

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type ArticleTag = Database["public"]["Tables"]["article_tags"]["Row"];

// Article status type
export type ArticleStatus = "published" | "draft" | "scheduled";

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
export type ArticleWithRelations = Omit<Article, "author_id" | "category_id"> & {
  author: SimpleProfile;
  category: Category;
  tags: Tag[];
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
};

export interface CommentWithAuthor extends Omit<Comment, "author_id"> {
  author: SimpleProfile;
  replies?: CommentWithAuthor[];
}

export interface Session {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// SEO metadata interface
export interface SEOMetadata {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
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

// Utility function to generate SEO metadata from article
export const generateSEOMetadata = (article: ArticleWithRelations): SEOMetadata => {
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    keywords: article.meta_keywords || "",
    canonicalUrl: article.canonical_url || "",
    ogImage: article.og_image || article.cover_image,
    ogType: "article",
    twitterCard: "summary_large_image"
  };
};
