
import { Separator } from "@/components/ui/separator";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { ArticleProps } from "@/data/mockData";

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
