import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { getUserFavorites } from "@/services/api";
import { ArticleWithRelations } from "@/lib/types";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<ArticleWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const data = await getUserFavorites();
        setFavorites(data);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching favorites:", error);
        setError(error.message || "Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  return (
    <PrivateRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Favorite Articles</h1>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-muted rounded-lg p-10 text-center">
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Browse articles and add them to your favorites to see them here.
              </p>
              <Button asChild>
                <Link to="/">Browse Articles</Link>
              </Button>
            </div>
          ) : (
            <ArticleGrid articles={favorites} columns={3} />
          )}
        </div>
      </MainLayout>
    </PrivateRoute>
  );
};

export default FavoritesPage;
