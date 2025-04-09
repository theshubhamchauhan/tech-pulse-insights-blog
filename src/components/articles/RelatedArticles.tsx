
import { Separator } from "@/components/ui/separator";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { articles } from "@/data/mockData";

interface ArticleProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
    bio?: string;
  };
  date: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

interface RelatedArticlesProps {
  articles: ArticleProps[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Separator className="mb-16" />
      
      <ArticleGrid
        articles={articles}
        title="Related Articles"
        description="Explore more insights and case studies on similar topics"
        columns={3}
      />
    </div>
  );
};

export default RelatedArticles;
