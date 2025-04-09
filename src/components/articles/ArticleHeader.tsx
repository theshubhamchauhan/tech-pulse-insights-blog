
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookmarkPlus, Share2, BookmarkCheck } from "lucide-react";
import { SimpleProfile, ensureAuthor } from "@/lib/types";

interface ArticleHeaderProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: SimpleProfile;
  onAddToFavorites: () => void;
  onShare: () => void;
  isFavorite?: boolean;
}

const ArticleHeader = ({
  title,
  excerpt,
  category,
  date,
  readTime,
  author,
  onAddToFavorites,
  onShare,
  isFavorite = false,
}: ArticleHeaderProps) => {
  // Convert SimpleProfile to Author to ensure avatar is not null
  const authorWithAvatar = ensureAuthor(author);

  return (
    <header className="max-w-4xl mx-auto mb-12">
      <div className="mb-6 flex items-center space-x-2">
        <Badge>{category}</Badge>
        <div className="flex items-center text-muted-foreground text-sm">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>{readTime}</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold leading-tight md:text-5xl mb-6">
        {title}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        {excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={authorWithAvatar.avatar} />
            <AvatarFallback>{authorWithAvatar.name.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{authorWithAvatar.name}</p>
            {authorWithAvatar.role && <p className="text-sm text-muted-foreground">{authorWithAvatar.role}</p>}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            onClick={onAddToFavorites}
          >
            {isFavorite ? (
              <>
                <BookmarkCheck className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
