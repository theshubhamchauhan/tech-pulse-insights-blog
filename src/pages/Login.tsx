
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <AuthForm type="login" />

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-500 hover:underline font-medium"
                >
                  Create account
                </Link>
              </p>
              <Button
                variant="link"
                asChild
                className="p-0 mt-1 text-muted-foreground hover:text-primary-500"
              >
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
