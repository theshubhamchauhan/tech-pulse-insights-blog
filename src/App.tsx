
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ArticleDetail from "./pages/ArticleDetail";
import Categories from "./pages/Categories";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import ArticleManagement from "./pages/admin/ArticleManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import CategoryManagement from "./pages/admin/CategoryManagement";
import UserManagement from "./pages/admin/UserManagement";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/article/:slug" element={<ArticleDetail />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/categories/:slug" element={<Categories />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/about" element={<About />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminDashboard />}>
      <Route index element={<Dashboard />} />
      <Route path="articles" element={<ArticleManagement />} />
      <Route path="articles/new" element={<ArticleEditor />} />
      <Route path="articles/edit/:id" element={<ArticleEditor />} />
      <Route path="categories" element={<CategoryManagement />} />
      <Route path="users" element={<UserManagement />} />
      {/* Additional admin routes would be added here */}
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
