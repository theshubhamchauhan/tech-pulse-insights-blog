
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/types";

interface ArticleContentProps {
  coverImage: string;
  title: string;
  content: string;
  tags?: Tag[];
}

const ArticleContent = ({
  coverImage,
  title,
  content,
  tags = [],
}: ArticleContentProps) => {
  return (
    <>
      {/* Feature Image */}
      <div className="max-w-5xl mx-auto mb-12">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      
      {/* Article Content */}
      <div className="max-w-4xl mx-auto mb-16">
        <div 
          className="article-content prose prose-lg prose-blue"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="outline">{tag.name}</Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleContent;
