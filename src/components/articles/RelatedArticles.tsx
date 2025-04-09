
import { Separator } from "@/components/ui/separator";
import ArticleGrid from "@/components/articles/ArticleGrid";
import type { ArticleWithRelations } from "@/lib/types";

interface RelatedArticlesProps {
  articles: ArticleWithRelations[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (!articles || articles.length === 0) return null;
  
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
