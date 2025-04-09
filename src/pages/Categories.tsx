
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { getCategories, getTags, getArticlesByCategory, getArticles } from "@/services/api";

const Categories = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  // Fetch all tags
  const { 
    data: tags = [], 
    isLoading: isLoadingTags 
  } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
  });
  
  // Fetch articles by category if slug is provided
  const { 
    data: categoryArticles = [], 
    isLoading: isLoadingCategoryArticles 
  } = useQuery({
    queryKey: ['categoryArticles', slug],
    queryFn: () => getArticlesByCategory(slug || ""),
    enabled: !!slug
  });
  
  // Fetch all articles if no slug is provided
  const { 
    data: allArticles = [], 
    isLoading: isLoadingAllArticles 
  } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    enabled: !slug
  });
  
  const articles = slug ? categoryArticles : allArticles;
  const isLoadingArticles = slug ? isLoadingCategoryArticles : isLoadingAllArticles;
  
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredTags, setFilteredTags] = useState(tags);

  // Update filtered categories and tags when search query changes
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(query)
        )
      );
      setFilteredTags(
        tags.filter((tag) => tag.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredCategories(categories);
      setFilteredTags(tags);
    }
  }, [searchQuery, categories, tags]);
  
  // Find selected category
  const selectedCategory = slug ? categories.find(c => c.slug === slug) : null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {slug && selectedCategory ? (
          // Show category specific view
          <>
            <div className="mb-12">
              <Link 
                to="/categories" 
                className="text-sm text-muted-foreground hover:text-primary-500 mb-4 flex items-center"
              >
                <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                Back to all categories
              </Link>
              <h1 className="text-4xl font-bold mb-4">{selectedCategory.name}</h1>
              <p className="text-xl text-muted-foreground">
                Browse all articles in the {selectedCategory.name} category
              </p>
            </div>
            
            {isLoadingArticles ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent mb-4"></div>
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : categoryArticles.length > 0 ? (
              <ArticleGrid articles={categoryArticles} columns={3} />
            ) : (
              <div className="text-center py-16 bg-muted rounded-lg">
                <p className="text-xl mb-4">No articles found in this category</p>
                <Button asChild>
                  <Link to="/categories">Browse other categories</Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          // Show all categories view
          <>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Explore Topics
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Browse our content by category or tag to find the insights and
                analysis most relevant to your interests
              </p>

              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories and tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories Section */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8">Categories</h2>
              {isLoadingCategories ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent mb-4"></div>
                  <p className="text-muted-foreground">Loading categories...</p>
                </div>
              ) : filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/categories/${category.slug}`}
                      className="group relative overflow-hidden rounded-lg h-48 flex flex-col justify-end p-6 hover-card-effect"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))`,
                        backgroundColor: `hsl(${
                          parseInt(category.id.slice(0, 8), 16) % 360
                        }, 70%, 55%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent" />
                      <div className="absolute inset-0 bg-primary-500/20 transform group-hover:bg-primary-500/10 transition-all duration-300" />

                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {category.name}
                        </h3>
                        <div className="flex items-center text-white">
                          <span>Browse articles</span>
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No categories found matching "{searchQuery}"
                </p>
              )}
            </section>

            {/* Tags Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">Popular Tags</h2>
              {isLoadingTags ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent mb-4"></div>
                  <p className="text-muted-foreground">Loading tags...</p>
                </div>
              ) : filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-base py-2 px-4 hover:bg-primary-100 cursor-pointer"
                      onClick={() => {
                        // In a real app, this would navigate to a filtered list of articles
                        console.log(`Filtering by tag: ${tag.name}`);
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No tags found matching "{searchQuery}"
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Categories;
