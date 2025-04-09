
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleProps } from "../articles/ArticleCard";
import { ArrowRight } from "lucide-react";

interface FeaturedArticleProps {
  article: ArticleProps;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/50" />
      </div>

      <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:py-40 xl:py-48">
        <div className="mx-auto max-w-3xl text-white">
          <div className="mb-4 flex items-center space-x-2">
            <Badge className="bg-primary-500 hover:bg-primary-600 px-3 py-1">
              {article.category}
            </Badge>
            <span className="text-sm">{article.readTime}</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {article.title}
          </h1>
          
          <p className="mb-8 max-w-xl text-lg text-gray-200">
            {article.excerpt}
          </p>
          
          <div className="mb-8 flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={article.author.avatar} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-medium">{article.author.name}</div>
              <div className="text-sm text-gray-300">{article.date}</div>
            </div>
          </div>
          
          <Button asChild size="lg" className="group">
            <Link to={`/article/${article.slug}`}>
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
