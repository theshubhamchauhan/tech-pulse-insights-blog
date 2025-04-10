
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Plus,
  Search,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Eye,
  Copy,
  Clock,
  AlertTriangle,
  Filter,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { articles, categories } from "@/data/mockData";

type ArticleStatus = "published" | "draft" | "scheduled";

interface ArticleData {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
  };
  date: string;
  status: ArticleStatus;
  views: number;
  slug: string;
}

const statusIcons = {
  published: <CheckCircle className="h-4 w-4 text-green-500" />,
  draft: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  scheduled: <Clock className="h-4 w-4 text-blue-500" />,
};

const statusLabels = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

const ArticleManagement = () => {
  const { toast } = useToast();
  
  // Convert the articles to the format needed by the component
  const articleData: ArticleData[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category.name,
    author: {
      name: article.author.name
    },
    date: new Date(article.created_at).toLocaleDateString(),
    status: ["published", "draft", "scheduled"][Math.floor(Math.random() * 3)] as ArticleStatus,
    views: Math.floor(Math.random() * 10000),
    slug: article.slug,
  }));
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleDelete = (id: string) => {
    // Mock delete - in a real app, this would call an API
    toast({
      title: "Article deleted",
      description: "The article has been deleted successfully.",
    });
    console.log("Delete article with ID:", id);
  };

  const handleDuplicate = (id: string) => {
    // Mock duplicate - in a real app, this would call an API
    toast({
      title: "Article duplicated",
      description: "The article has been duplicated successfully.",
    });
    console.log("Duplicate article with ID:", id);
  };

  // Filter and sort articles
  const filteredArticles = articleData.filter((article) => {
    // Search filter
    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== "all" && article.category !== categoryFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && article.status !== statusFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort articles
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "views":
        return b.views - a.views;
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "newest":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
        <Button asChild>
          <Link to="/admin/articles/new">
            <Plus className="mr-2 h-5 w-5" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>{article.author.name}</TableCell>
                  <TableCell>{article.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[article.status]}
                      <span>{statusLabels[article.status]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{article.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/articles/edit/${article.id}`}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/article/${article.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(article.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ArticleManagement;
