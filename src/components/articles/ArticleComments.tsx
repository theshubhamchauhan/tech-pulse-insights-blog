
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentWithAuthor } from "@/lib/types";

interface ArticleCommentsProps {
  comments: CommentWithAuthor[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  onCommentSubmit: (content: string, parentId?: string) => void;
}

const ArticleComments = ({ 
  comments, 
  isAuthenticated, 
  isLoading,
  isSubmitting,
  onCommentSubmit
}: ArticleCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    onCommentSubmit(commentText);
    setCommentText("");
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    onCommentSubmit(replyText, parentId);
    setReplyText("");
    setReplyTo(null);
  };

  return (
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
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || ""} />
                    <AvatarFallback>{comment.author.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {isAuthenticated && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  >
                    Reply
                  </Button>
                )}
              </div>
              
              <p className="text-foreground">{comment.content}</p>
              
              {replyTo === comment.id && isAuthenticated && (
                <form 
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="mt-4 ml-6 pt-4 border-t"
                >
                  <Textarea
                    placeholder={`Reply to ${comment.author.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={isSubmitting || !replyText.trim()}
                    >
                      {isSubmitting ? "Posting..." : "Post Reply"}
                    </Button>
                  </div>
                </form>
              )}
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-6 pt-4 border-t">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="mb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar || ""} />
                          <AvatarFallback>{reply.author.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{reply.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString("en-US", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
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
