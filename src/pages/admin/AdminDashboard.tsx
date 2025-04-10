
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  FolderOpen,
  PenTool
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if a path is active (exact match or starts with)
  const isActivePath = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    if (path !== "/admin" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileSidebar}
          className="bg-background"
        >
          {isMobileSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-card border-r transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link
              to="/admin"
              className="text-2xl font-bold flex items-center"
              onClick={closeMobileSidebar}
            >
              Duck<span className="text-primary-500">cod</span>
              <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
                Admin
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            <Button
              variant={isActivePath("/admin") && location.pathname === "/admin" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin" onClick={closeMobileSidebar}>
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              variant={isActivePath("/admin/articles") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/articles" onClick={closeMobileSidebar}>
                <FileText className="mr-2 h-5 w-5" />
                Articles
              </Link>
            </Button>
            
            <Button
              variant={isActivePath("/admin/authors") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/authors" onClick={closeMobileSidebar}>
                <PenTool className="mr-2 h-5 w-5" />
                Authors
              </Link>
            </Button>
            
            <Button
              variant={isActivePath("/admin/categories") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/categories" onClick={closeMobileSidebar}>
                <FolderOpen className="mr-2 h-5 w-5" />
                Categories
              </Link>
            </Button>
            
            <Button
              variant={isActivePath("/admin/users") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/users" onClick={closeMobileSidebar}>
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </Button>
            
            <Button
              variant={isActivePath("/admin/settings") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/settings" onClick={closeMobileSidebar}>
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>
          </nav>

          <div className="p-6 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  
  // Get title based on current path
  const getTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/articles") return "Articles";
    if (location.pathname.includes("/admin/articles/new")) return "Create New Article";
    if (location.pathname.includes("/admin/articles/edit")) return "Edit Article";
    if (location.pathname === "/admin/categories") return "Categories";
    if (location.pathname === "/admin/users") return "Users";
    if (location.pathname === "/admin/authors") return "Authors";
    if (location.pathname === "/admin/settings") return "Settings";
    return "Admin Dashboard";
  };
  
  // Determine if we should show the "New Article" button
  const showNewArticleButton = location.pathname === "/admin/articles";
  
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:ml-64 min-h-screen">
        <header className="bg-card border-b py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          {showNewArticleButton && (
            <Button asChild>
              <Link to="/admin/articles/new">
                <Plus className="mr-2 h-5 w-5" />
                New Article
              </Link>
            </Button>
          )}
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
