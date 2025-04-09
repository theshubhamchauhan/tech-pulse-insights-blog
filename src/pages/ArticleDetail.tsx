
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleContent from "@/components/articles/ArticleContent";
import AuthorBio from "@/components/articles/AuthorBio";
import ArticleComments from "@/components/articles/ArticleComments";
import RelatedArticles from "@/components/articles/RelatedArticles";
import ArticleNotFound from "@/components/articles/ArticleNotFound";
import { ArticleWithRelations, CommentWithAuthor } from "@/lib/types";
import { 
  getArticleBySlug, 
  getArticlesByCategory, 
  getCommentsByArticleId,
  toggleFavorite,
  checkIsFavorite,
  addComment
} from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch article data
  const { 
    data: article, 
    isLoading: isLoadingArticle,
    error: articleError 
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug || ""),
    enabled: !!slug
  });
  
  // Fetch comments
  const { 
    data: comments = [], 
    isLoading: isLoadingComments 
  } = useQuery({
    queryKey: ['comments', article?.id],
    queryFn: () => getCommentsByArticleId(article?.id || ""),
    enabled: !!article?.id
  });
  
  // Fetch related articles
  const { 
    data: relatedArticles = [], 
    isLoading: isLoadingRelated 
  } = useQuery({
    queryKey: ['relatedArticles', article?.category?.slug],
    queryFn: () => getArticlesByCategory(article?.category?.slug || ""),
    select: (data) => data.filter(a => a.id !== article?.id).slice(0, 3),
    enabled: !!article?.category?.slug
  });
  
  // Check if article is favorited
  useEffect(() => {
    if (isAuthenticated && article?.id) {
      const checkFavorite = async () => {
        try {
          const result = await checkIsFavorite(article.id);
          setIsFavorite(result);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };
      
      checkFavorite();
    }
  }, [isAuthenticated, article?.id]);
  
  // Toggle favorite mutation
  const favoriteToggleMutation = useMutation({
    mutationFn: () => toggleFavorite(article?.id || ""),
    onSuccess: (newState) => {
      setIsFavorite(newState);
      toast.success(newState ? "Added to favorites" : "Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: any) => {
      toast.error("Failed to update favorites");
    }
  });
  
  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string, parentId?: string }) => 
      addComment(article?.id || "", content, parentId),
    onSuccess: () => {
      toast.success("Comment posted successfully");
      queryClient.invalidateQueries({ queryKey: ['comments', article?.id] });
    },
    onError: (error: any) => {
      toast.error("Failed to post comment");
    }
  });

  // Handle favorite toggle
  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      toast("Authentication required", {
        description: "Please log in to add this article to your favorites.",
      });
      navigate("/login");
      return;
    }
    
    favoriteToggleMutation.mutate();
  };

  // Handle article sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied", {
        description: "Article link copied to clipboard.",
      });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (content: string, parentId?: string) => {
    if (!isAuthenticated) {
      toast("Authentication required", {
        description: "Please log in to comment on this article.",
      });
      navigate("/login");
      return;
    }
    
    addCommentMutation.mutate({ content, parentId });
  };

  if (isLoadingArticle) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </MainLayout>
    );
  }

  if (articleError || !article) {
    return <ArticleNotFound />;
  }

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8">
        <ArticleHeader 
          title={article.title}
          excerpt={article.excerpt}
          category={article.category.name}
          date={new Date(article.created_at).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          readTime={article.read_time}
          author={article.author}
          onAddToFavorites={handleAddToFavorites}
          onShare={handleShare}
          isFavorite={isFavorite}
        />
        
        <ArticleContent 
          coverImage={article.cover_image}
          title={article.title}
          content={article.content}
          tags={article.tags}
        />
        
        <AuthorBio author={article.author} />
        
        <ArticleComments 
          comments={comments}
          isAuthenticated={isAuthenticated}
          isLoading={isLoadingComments}
          onCommentSubmit={handleCommentSubmit}
          isSubmitting={addCommentMutation.isPending}
        />
        
        {!isLoadingRelated && relatedArticles.length > 0 && (
          <RelatedArticles articles={relatedArticles} />
        )}
      </article>
    </MainLayout>
  );
};

export default ArticleDetail;
