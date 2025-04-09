
import { ReactNode } from "react";
import ArticleCard, { ArticleProps } from "./ArticleCard";
import { ArticleWithRelations } from "@/lib/types";

interface ArticleGridProps {
  articles: (ArticleProps | ArticleWithRelations)[];
  featured?: boolean;
  title?: string;
  description?: string;
  action?: ReactNode;
  columns?: number;
}

const ArticleGrid = ({
  articles,
  featured = false,
  title,
  description,
  action,
  columns = 3,
}: ArticleGridProps) => {
  if (!articles || articles.length === 0) return null;

  const colsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns] || "md:grid-cols-3";

  return (
    <div className="w-full">
      {(title || description || action) && (
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            {title && (
              <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground max-w-2xl">{description}</p>
            )}
          </div>
          {action && <div className="mt-4 md:mt-0">{action}</div>}
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
        {featured && articles[0] && (
          <div className="col-span-full mb-4">
            <ArticleCard article={articles[0]} variant="featured" />
          </div>
        )}
        
        {(featured ? articles.slice(1) : articles).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;
