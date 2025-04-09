
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";

const ForgotPassword = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <AuthForm type="forgotPassword" />

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-primary-500 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
