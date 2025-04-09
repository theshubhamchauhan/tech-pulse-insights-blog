
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { categories, tags } from "@/data/mockData";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredTags, setFilteredTags] = useState(tags);

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
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-lg h-48 flex flex-col justify-end p-6 hover-card-effect"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))`,
                  backgroundColor: `hsl(${
                    parseInt(category.id, 10) * 30
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
        </section>

        {/* Tags Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Popular Tags</h2>
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
        </section>
      </div>
    </MainLayout>
  );
};

export default Categories;
