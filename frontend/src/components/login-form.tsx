import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../features/store";
import { loginUser } from "@/features/auth/authAPI";
import BackButton from "./BackButton";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(16, "Password cannot exceed 16 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const handleNav = (path: string) => {
    navigate(path);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
          role: "user",
        })
      ).unwrap();

      if (result) {
        toast.success('Login successfully')
        handleNav("/user/dashboard");
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle field-specific errors
        if (error.response?.data?.field === 'email') {
          setError('email', { type: 'manual', message: error.response?.data.message });
        } else if (error.response?.data?.field === 'password') {
          setError('password', { type: 'manual', message: error.response?.data.message });
        } else {
          // Handle general errors
          setError('root', { type: 'manual', message: error.response?.data?.message || 'An error occurred' });
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
              <p className="text-red-600 text-sm text-center">
                {errors.root.message}
              </p>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                    onClick={() => handleNav("/user/forget")}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" variant="default" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5 mr-2"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.15 0 5.7 1.05 7.8 3.15l5.85-5.85C33.9 3.6 29.4 1.5 24 1.5 14.7 1.5 7.2 7.95 4.35 16.2l6.75 5.25C12.9 14.1 17.85 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24c0-1.5-.15-3-.45-4.5H24v9h12.75c-.6 3-2.4 5.4-4.95 7.05l6.75 5.25C42.75 37.5 46.5 31.2 46.5 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.1 28.2c-1.05-3-1.05-6.3 0-9.3l-6.75-5.25c-3 6-3 13.8 0 19.8l6.75-5.25z"
                  />
                  <path
                    fill="#4285F4"
                    d="M24 46.5c5.4 0 10.2-1.8 13.8-4.95l-6.75-5.25c-2.1 1.35-4.8 2.1-7.05 2.1-6.15 0-11.1-4.65-12.75-10.65l-6.75 5.25C7.2 40.05 14.7 46.5 24 46.5z"
                  />
                </svg>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                className="underline underline-offset-4 cursor-pointer"
                onClick={() => handleNav("/user/register")}
              >
                Sign up
              </a>
            </div>
            <div className="mt-4 text-center text-sm">
              Are You A Inspector{" "}
              <a
                className="underline underline-offset-4 cursor-pointer"
                onClick={() => handleNav("/inspector/login")}
              >
                Click Here
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
