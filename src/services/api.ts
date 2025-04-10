import { supabase } from "@/integrations/supabase/client";
import type { 
  ArticleWithRelations, 
  CommentWithAuthor, 
  Profile, 
  SimpleProfile,
  Category, 
  Tag,
  ArticleStatus,
  Article
} from "@/lib/types";

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

// Tags
export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

// Articles
export async function getArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio),
      category:category_id(*)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Fetch tags for each article
  const articlesWithTags = await Promise.all(
    data.map(async (article) => {
      const { data: tagData, error: tagError } = await supabase
        .from('article_tags')
        .select('tags(*)')
        .eq('article_id', article.id);
      
      if (tagError) throw tagError;
      
      const mappedArticle: ArticleWithRelations = {
        ...article as Article,
        author: article.author as SimpleProfile,
        category: article.category as Category,
        tags: tagData?.map(t => t.tags) || []
      };
      
      return mappedArticle;
    })
  );
  
  return articlesWithTags;
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio),
      category:category_id(*)
    `)
    .eq('slug', slug)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  // Fetch tags for the article
  const { data: tagData, error: tagError } = await supabase
    .from('article_tags')
    .select('tags(*)')
    .eq('article_id', data.id);
  
  if (tagError) throw tagError;
  
  const mappedArticle: ArticleWithRelations = {
    ...data as Article,
    author: data.author as SimpleProfile,
    category: data.category as Category,
    tags: tagData?.map(t => t.tags) || []
  };
  
  return mappedArticle;
}

export async function getFeaturedArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio),
      category:category_id(*)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Fetch tags for each article
  const articlesWithTags = await Promise.all(
    data.map(async (article) => {
      const { data: tagData, error: tagError } = await supabase
        .from('article_tags')
        .select('tags(*)')
        .eq('article_id', article.id);
      
      if (tagError) throw tagError;
      
      const mappedArticle: ArticleWithRelations = {
        ...article as Article,
        author: article.author as SimpleProfile,
        category: article.category as Category,
        tags: tagData?.map(t => t.tags) || []
      };
      
      return mappedArticle;
    })
  );
  
  return articlesWithTags;
}

export async function getArticlesByCategory(categorySlug: string): Promise<ArticleWithRelations[]> {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
  
  if (categoryError) throw categoryError;
  if (!category) return [];
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio),
      category:category_id(*)
    `)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Fetch tags for each article
  const articlesWithTags = await Promise.all(
    data.map(async (article) => {
      const { data: tagData, error: tagError } = await supabase
        .from('article_tags')
        .select('tags(*)')
        .eq('article_id', article.id);
      
      if (tagError) throw tagError;
      
      const mappedArticle: ArticleWithRelations = {
        ...article as Article,
        author: article.author as SimpleProfile,
        category: article.category as Category,
        tags: tagData?.map(t => t.tags) || []
      };
      
      return mappedArticle;
    })
  );
  
  return articlesWithTags;
}

// Comments
export async function getCommentsByArticleId(articleId: string): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio)
    `)
    .eq('article_id', articleId)
    .is('parent_id', null)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Fetch replies for each comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const { data: replyData, error: replyError } = await supabase
        .from('comments')
        .select(`
          *,
          author:author_id(id, name, avatar, role, bio)
        `)
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });
      
      if (replyError) throw replyError;
      
      return {
        ...comment,
        author: comment.author as SimpleProfile,
        replies: replyData?.map(reply => ({
          ...reply,
          author: reply.author as SimpleProfile
        })) || []
      } as CommentWithAuthor;
    })
  );
  
  return commentsWithReplies;
}

export async function addComment(articleId: string, content: string, parentId?: string): Promise<CommentWithAuthor> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('User not authenticated');
  
  const newComment = {
    article_id: articleId,
    author_id: userData.user.id,
    content,
    parent_id: parentId || null
  };
  
  const { data, error } = await supabase
    .from('comments')
    .insert(newComment)
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio)
    `)
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    author: data.author as SimpleProfile
  } as CommentWithAuthor;
}

// Favorites
export async function toggleFavorite(articleId: string): Promise<boolean> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('User not authenticated');
  
  // Check if article is already favorited
  const { data: existing, error: checkError } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('article_id', articleId)
    .maybeSingle();
  
  if (checkError) throw checkError;
  
  // If favorited, remove it
  if (existing) {
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userData.user.id)
      .eq('article_id', articleId);
    
    if (deleteError) throw deleteError;
    return false; // Not favorited anymore
  }
  
  // If not favorited, add it
  const { error: insertError } = await supabase
    .from('favorites')
    .insert({
      user_id: userData.user.id,
      article_id: articleId
    });
  
  if (insertError) throw insertError;
  return true; // Now favorited
}

export async function checkIsFavorite(articleId: string): Promise<boolean> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return false;
  if (!userData.user) return false;
  
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('article_id', articleId)
    .maybeSingle();
  
  if (error) return false;
  return !!data;
}

export async function getUserFavorites(): Promise<ArticleWithRelations[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('User not authenticated');
  
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('article_id')
    .eq('user_id', userData.user.id);
  
  if (favError) throw favError;
  if (!favorites.length) return [];
  
  const articleIds = favorites.map(fav => fav.article_id);
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:author_id(id, name, avatar, role, bio),
      category:category_id(*)
    `)
    .in('id', articleIds)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Fetch tags for each article
  const articlesWithTags = await Promise.all(
    data.map(async (article) => {
      const { data: tagData, error: tagError } = await supabase
        .from('article_tags')
        .select('tags(*)')
        .eq('article_id', article.id);
      
      if (tagError) throw tagError;
      
      const mappedArticle: ArticleWithRelations = {
        ...article as Article,
        author: article.author as SimpleProfile,
        category: article.category as Category,
        tags: tagData?.map(t => t.tags) || []
      };
      
      return mappedArticle;
    })
  );
  
  return articlesWithTags;
}

// User profile
export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userData.user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
