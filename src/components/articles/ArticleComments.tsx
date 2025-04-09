
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CommentProps } from "@/data/mockData";

interface ArticleCommentsProps {
  comments: CommentProps[];
  articleId: string;
  isAuthenticated: boolean;
}

const ArticleComments = ({ comments, articleId, isAuthenticated }: ArticleCommentsProps) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayedComments, setDisplayedComments] = useState<CommentProps[]>(comments);

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
        articleId: articleId,
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
      
      setDisplayedComments([...displayedComments, newComment]);
      setCommentText("");
      setIsSubmitting(false);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <h3 className="text-2xl font-bold mb-6">Comments ({displayedComments.length})</h3>
      
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
      
      {displayedComments.length > 0 ? (
        <div className="space-y-6">
          {displayedComments.map((comment) => (
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
  );
};

export default ArticleComments;
