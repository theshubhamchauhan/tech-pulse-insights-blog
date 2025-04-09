
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ArticleProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  slug: string;
  featured?: boolean;
  isFavorite?: boolean;
}

interface ArticleCardProps {
  article: ArticleProps;
  variant?: "default" | "featured" | "horizontal";
}

const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  const isAuthenticated = false; // In a real app, this would come from auth context

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would add the article to favorites
    console.log("Add to favorites:", article.id);
  };

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden border-0 shadow-lg hover-card-effect">
        <div className="relative h-[400px] w-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="mb-3 flex items-center space-x-2">
              <Badge className="bg-primary-500 hover:bg-primary-600">
                {article.category}
              </Badge>
              <span className="text-xs">{article.readTime}</span>
            </div>
            <Link to={`/article/${article.slug}`}>
              <h3 className="mb-2 text-2xl font-bold leading-tight text-white hover:text-primary-200 md:text-3xl">
                {article.title}
              </h3>
            </Link>
            <p className="mb-4 line-clamp-2 text-gray-200">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-gray-300">{article.date}</p>
                </div>
              </div>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary-200 hover:bg-white/10"
                  onClick={handleAddToFavorites}
                >
                  <BookmarkPlus className="h-5 w-5" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "horizontal") {
    return (
      <Card className="overflow-hidden border hover-card-effect">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="relative h-48 md:h-full overflow-hidden md:col-span-1">
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="md:col-span-2 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleAddToFavorites}
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              )}
            </div>
            <Link to={`/article/${article.slug}`}>
              <h3 className="mb-2 text-xl font-bold leading-tight hover:text-primary-500 md:text-2xl">
                {article.title}
              </h3>
            </Link>
            <p className="mb-4 line-clamp-2 text-muted-foreground">{article.excerpt}</p>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{article.author.name}</p>
                <p className="text-xs text-muted-foreground">{article.date}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default card
  return (
    <Card className="overflow-hidden border hover-card-effect h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-white/80 hover:bg-white"
            onClick={handleAddToFavorites}
          >
            <BookmarkPlus className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        )}
      </div>
      <CardContent className="flex-1 p-5">
        <div className="mb-3 flex items-center space-x-2">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
        </div>
        <Link to={`/article/${article.slug}`}>
          <h3 className="mb-2 text-lg font-bold leading-tight hover:text-primary-500">
            {article.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
      </CardContent>
      <CardFooter className="border-t p-5 pt-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={article.author.avatar} />
            <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.date}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
