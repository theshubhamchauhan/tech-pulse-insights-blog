
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookmarkPlus, Share2, Calendar, Clock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { getArticleBySlug, getCommentsByArticleId, articles, CommentProps } from "@/data/mockData";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState(getArticleBySlug(slug || ""));
  const [relatedArticles, setRelatedArticles] = useState(articles.slice(0, 3));
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on this article.",
      });
      return;
    }
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    // Mock submitting a comment - in a real app, this would call an API
    setTimeout(() => {
      const newComment: CommentProps = {
        id: `new-${Date.now()}`,
        articleId: article?.id || "",
        author: {
          name: "Current User",
          avatar: "https://i.pravatar.cc/150?img=11",
        },
        content: commentText,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      
      setComments([...comments, newComment]);
      setCommentText("");
      setIsSubmitting(false);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    }, 1000);
  };

  if (!article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-12">
          <div className="mb-6 flex items-center space-x-2">
            <Badge>{article.category}</Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight md:text-5xl mb-6">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm text-muted-foreground">{article.author.role}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToFavorites}
              >
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>
        
        {/* Feature Image */}
        <div className="max-w-5xl mx-auto mb-12">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        {/* Article Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="article-content prose prose-lg prose-blue">
            <p>
              The rapid advancement of technology continues to reshape industries across the globe. From healthcare to finance, manufacturing to retail, technology is not just enhancing existing processes but fundamentally transforming how businesses operate and deliver value to customers.
            </p>
            
            <p>
              In this case study, we explore how organizations are leveraging cutting-edge technologies to gain competitive advantages, improve efficiency, and create innovative solutions to complex problems.
            </p>
            
            <h2>The Transformative Power of Technology</h2>
            
            <p>
              Technology's impact on business operations can be seen across various dimensions:
            </p>
            
            <ul>
              <li>
                <strong>Enhanced Efficiency:</strong> Automation and AI are streamlining operations, reducing costs, and minimizing human error.
              </li>
              <li>
                <strong>Improved Customer Experience:</strong> Digital tools and platforms are creating more personalized, responsive, and seamless customer interactions.
              </li>
              <li>
                <strong>Data-Driven Decision Making:</strong> Advanced analytics and big data are enabling organizations to make more informed strategic choices.
              </li>
              <li>
                <strong>Innovation Acceleration:</strong> New technologies are facilitating rapid experimentation and faster time-to-market for new products and services.
              </li>
            </ul>
            
            <h2>Key Challenges and Considerations</h2>
            
            <p>
              Despite the immense potential of technology, organizations must navigate several challenges:
            </p>
            
            <ol>
              <li>
                <strong>Integration Complexity:</strong> Incorporating new technologies into existing systems and processes can be technically challenging and resource-intensive.
              </li>
              <li>
                <strong>Talent and Skills Gap:</strong> Many organizations struggle to find and retain talent with the specialized skills needed to implement and manage advanced technologies.
              </li>
              <li>
                <strong>Security and Privacy Concerns:</strong> As technology adoption increases, so do the risks related to data security, privacy, and regulatory compliance.
              </li>
              <li>
                <strong>Change Management:</strong> Successful technology implementation requires effective change management to address cultural resistance and ensure adoption.
              </li>
            </ol>
            
            <blockquote>
              <p>
                "The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency. The second is that automation applied to an inefficient operation will magnify the inefficiency."
              </p>
              <footer>— Bill Gates</footer>
            </blockquote>
            
            <h2>Future Outlook</h2>
            
            <p>
              Looking ahead, we anticipate several trends that will shape the technology landscape:
            </p>
            
            <p>
              First, <strong>AI and machine learning</strong> will continue to evolve, becoming more accessible and embedded in everyday business operations. Second, <strong>edge computing</strong> will gain momentum as organizations seek to process data closer to its source, reducing latency and bandwidth usage. Third, <strong>quantum computing</strong> will begin to move from experimental to practical applications, potentially revolutionizing fields such as cryptography, materials science, and drug discovery.
            </p>
            
            <p>
              Organizations that can effectively navigate these trends, addressing the associated challenges while leveraging the opportunities they present, will be well-positioned for success in an increasingly technology-driven business environment.
            </p>
            
            <h2>Conclusion</h2>
            
            <p>
              Technology continues to be a powerful force for business transformation. By understanding the potential impact, addressing key challenges, and staying abreast of emerging trends, organizations can harness technology to drive sustainable competitive advantage.
            </p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Technology</Badge>
            <Badge variant="outline">Innovation</Badge>
            <Badge variant="outline">Digital Transformation</Badge>
            <Badge variant="outline">Case Study</Badge>
            <Badge variant="outline">Business Strategy</Badge>
          </div>
        </div>
        
        {/* Author Bio */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-muted p-8 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{article.author.name}</h3>
                <p className="text-muted-foreground">{article.author.role}</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              {article.author.bio || "An experienced writer and researcher with expertise in technology trends and their impact on business and society."}
            </p>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
          
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-4 min-h-[100px]"
              />
              <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <div className="bg-muted p-6 rounded-lg mb-8">
              <p className="mb-4 text-center">
                Please log in to join the discussion and post comments
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          )}
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{comment.author.name}</p>
                        <p className="text-sm text-muted-foreground">{comment.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-foreground">{comment.content}</p>
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 pt-4 border-t">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mb-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{reply.author.name}</p>
                              <p className="text-xs text-muted-foreground">{reply.date}</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground ml-9">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
        
        {/* Related Articles */}
        <div className="max-w-7xl mx-auto">
          <Separator className="mb-16" />
          
          <ArticleGrid
            articles={relatedArticles}
            title="Related Articles"
            description="Explore more insights and case studies on similar topics"
            columns={3}
          />
        </div>
      </article>
    </MainLayout>
  );
};

export default ArticleDetail;
