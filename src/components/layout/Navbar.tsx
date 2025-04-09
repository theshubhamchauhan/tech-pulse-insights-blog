
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  X,
  User,
  BookMarked,
  LogIn,
  PenSquare,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === "admin";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search results page with query
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
      // In a real implementation, redirect to /search?q=${searchQuery}
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-heading font-bold text-xl sm:inline-block">
              Tech<span className="text-primary-500">Pulse</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary-500">
              Home
            </Link>
            <Link to="/categories" className="transition-colors hover:text-primary-500">
              Categories
            </Link>
            <Link to="/about" className="transition-colors hover:text-primary-500">
              About
            </Link>
          </nav>
        </div>

        <div className="flex-1" />

        <div className="flex items-center justify-end space-x-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex-1 md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full md:w-[200px] pl-8 focus-visible:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={toggleSearch}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="hover:text-primary-500"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favorites">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </Button>
                
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="flex items-center">
                        <BookMarked className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <PenSquare className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 bg-background shadow-md animate-in slide-in-from-top">
          <div className="relative z-20 grid gap-6 rounded-md bg-background p-4">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              <Link
                to="/"
                className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                onClick={toggleMenu}
              >
                About
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                    onClick={toggleMenu}
                  >
                    <BookMarked className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                      onClick={toggleMenu}
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex w-full items-center rounded-md p-2 hover:bg-accent"
                    onClick={toggleMenu}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="flex w-full items-center rounded-md p-2 text-destructive hover:bg-accent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex w-full items-center rounded-md bg-primary-500 text-white p-2 hover:bg-primary-600"
                  onClick={toggleMenu}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
