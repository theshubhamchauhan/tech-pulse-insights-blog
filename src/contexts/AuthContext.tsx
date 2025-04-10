
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Session } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

interface AuthContextType extends Session {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAdminIfNotExists: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseSession, setSupabaseSession] = useState<any>(null);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSupabaseSession(session);
        if (session?.user) {
          // Fetch the user profile when session changes
          fetchUserProfile(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Create admin user if none exists
    createAdminIfNotExists();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;
      setUser(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminIfNotExists = async () => {
    try {
      // Check if admin exists
      const { data: adminUsers, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "admin");
      
      if (checkError) throw checkError;
      
      // If no admin exists, create one
      if (!adminUsers || adminUsers.length === 0) {
        const adminEmail = "admin@duckcod.com";
        const adminPassword = "Admin123!";
        
        // Check if user with email exists
        const { data: existingUser, error: userCheckError } = await supabase
          .auth.admin.getUserByEmail(adminEmail);
        
        if (!existingUser) {
          // Create admin user
          const { data: newAdmin, error: createError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: {
              name: "Admin User",
              role: "admin",
            },
          });

          if (createError) throw createError;
          
          // Update profile with admin role
          if (newAdmin?.user) {
            const { error: profileError } = await supabase
              .from("profiles")
              .update({
                role: "admin",
              })
              .eq("id", newAdmin.user.id);

            if (profileError) throw profileError;
            
            console.log("Admin user created: admin@duckcod.com / Admin123!");
          }
        }
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account."
      });
      
      navigate("/login");
    } catch (error: any) {
      toast.error("Sign up failed", { description: error.message });
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error("Sign in failed", { description: error.message });
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Sign out failed", { description: error.message });
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    createAdminIfNotExists
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
