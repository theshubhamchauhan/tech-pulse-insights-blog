
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type AuthFormType = "login" | "register" | "forgotPassword";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type FormValues = LoginFormValues | RegisterFormValues | ForgotPasswordFormValues;

const AuthForm = ({ type }: { type: AuthFormType }) => {
  const { signIn, signUp, isLoading } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const schema = 
    type === "login" ? loginSchema :
    type === "register" ? registerSchema :
    forgotPasswordSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(type === "login" || type === "register" || type === "forgotPassword" ? { email: "" } : {}),
      ...(type === "login" || type === "register" ? { password: "" } : {}),
      ...(type === "register" ? { name: "", confirmPassword: "" } : {}),
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (type === "login") {
        const loginValues = values as LoginFormValues;
        await signIn(loginValues.email, loginValues.password);
      } else if (type === "register") {
        const registerValues = values as RegisterFormValues;
        await signUp(registerValues.email, registerValues.password, registerValues.name);
      } else if (type === "forgotPassword") {
        // Handle password reset
        const forgotPasswordValues = values as ForgotPasswordFormValues;
        await supabase.auth.resetPasswordForEmail(forgotPasswordValues.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  if (type === "forgotPassword" && resetEmailSent) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Password Reset Email Sent</h3>
        <p className="text-muted-foreground mb-4">
          If an account exists with that email, you will receive instructions to reset your password.
        </p>
        <Button asChild>
          <Link to="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {type === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(type === "login" || type === "register") && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "register" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              {type === "login" && "Sign In"}
              {type === "register" && "Create Account"}
              {type === "forgotPassword" && "Reset Password"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
