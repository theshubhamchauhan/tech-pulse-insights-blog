
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleContent from "@/components/articles/ArticleContent";
import AuthorBio from "@/components/articles/AuthorBio";
import ArticleComments from "@/components/articles/ArticleComments";
import RelatedArticles from "@/components/articles/RelatedArticles";
import ArticleNotFound from "@/components/articles/ArticleNotFound";
import { getArticleBySlug, getCommentsByArticleId, articles, CommentProps } from "@/data/mockData";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState(getArticleBySlug(slug || ""));
  const [relatedArticles, setRelatedArticles] = useState(articles.slice(0, 3));
  const [comments, setComments] = useState<CommentProps[]>([]);
  
  // Mock authentication state - in a real app, this would come from an auth context
  const isAuthenticated = false;

  useEffect(() => {
    if (slug) {
      const foundArticle = getArticleBySlug(slug);
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Get related articles (same category, excluding current article)
        const related = articles
          .filter(
            (a) => 
              a.category === foundArticle.category && 
              a.id !== foundArticle.id
          )
          .slice(0, 3);
        setRelatedArticles(related);
        
        // Get comments for the article
        const articleComments = getCommentsByArticleId(foundArticle.id);
        setComments(articleComments);
      }
    }
  }, [slug]);

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add this article to your favorites.",
      });
      return;
    }
    
    toast({
      title: "Added to favorites",
      description: "This article has been added to your favorites.",
    });
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API if available
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
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard.",
      });
    }
  };

  if (!article) {
    return <ArticleNotFound />;
  }

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8">
        <ArticleHeader 
          title={article.title}
          excerpt={article.excerpt}
          category={article.category}
          date={article.date}
          readTime={article.readTime}
          author={article.author}
          onAddToFavorites={handleAddToFavorites}
          onShare={handleShare}
        />
        
        <ArticleContent 
          coverImage={article.coverImage}
          title={article.title}
        />
        
        <AuthorBio author={article.author} />
        
        <ArticleComments 
          comments={comments}
          articleId={article.id}
          isAuthenticated={isAuthenticated}
        />
        
        <RelatedArticles articles={relatedArticles} />
      </article>
    </MainLayout>
  );
};

export default ArticleDetail;
