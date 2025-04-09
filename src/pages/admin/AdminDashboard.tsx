
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Plus,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSidebar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Mock logout - in a real app, this would call an auth API
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
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
              Tech<span className="text-primary-500">Pulse</span>
              <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
                Admin
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin" onClick={closeMobileSidebar}>
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/articles" onClick={closeMobileSidebar}>
                <FileText className="mr-2 h-5 w-5" />
                Articles
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link to="/admin/users" onClick={closeMobileSidebar}>
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </Button>
            <Button
              variant="ghost"
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
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:ml-64 min-h-screen">
        <header className="bg-card border-b py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button asChild>
            <Link to="/admin/articles/new">
              <Plus className="mr-2 h-5 w-5" />
              New Article
            </Link>
          </Button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
