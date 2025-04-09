
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import FeaturedArticle from "@/components/home/FeaturedArticle";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { articles, categories } from "@/data/mockData";

const Index = () => {
  const featuredArticle = articles.find((article) => article.featured) || articles[0];
  const latestArticles = articles.slice(0, 6);
  const topCategories = categories.slice(0, 4);

  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-8">
        {/* Hero Section with Featured Article */}
        <FeaturedArticle article={featuredArticle} />

        {/* Latest Articles Section */}
        <section className="mt-24 mb-16">
          <ArticleGrid
            articles={latestArticles}
            title="Latest Articles"
            description="Discover our most recent insights, case studies, and analysis on the latest technology trends and innovations."
            action={
              <Button variant="outline" asChild>
                <Link to="/articles" className="group">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            }
          />
        </section>

        {/* Categories Section */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Explore Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our content by topic to find the insights and analysis most relevant to your interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-lg h-64 flex flex-col justify-end p-6 hover-card-effect"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/50 to-transparent" />
                <div className="absolute inset-0 bg-primary-500/20 transform group-hover:bg-primary-500/10 transition-all duration-300" />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                  <div className="flex items-center text-white">
                    <span>Browse articles</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/categories" className="group">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary-50 rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest insights, case studies, and analysis on technology trends.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Index;
