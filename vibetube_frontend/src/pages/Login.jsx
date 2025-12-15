"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";

import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters.",
    })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const RegisterPage = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const message = location.state?.errorMessage;
    const successMsg = location.state?.successMessage;
    if (message) {
      // Show the toast
      toast.custom((t) => (
        <div className="bg-gradient-to-r from-destructive to-primary text-white p-3 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex items-center gap-3">
            <Heart className="h-3 w-5" />
            <div>
              <div className="font-semibold  text-sm">{message}</div>
              <div className="text-sm opacity-95"></div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="ml-auto bg-white/20 hover:bg-white/30 rounded-full h-8 w-8 text-xs font-semibold flex items-center justify-center shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      ));

      // CRITICAL: Clear the state immediately after showing the toast
      // The `replace: true` is essential here.
      navigate(location.pathname, { replace: true, state: {} });
    } else if (successMsg) {
      toast.custom((t) => (
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-2 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex items-center gap-3">
            <Heart className="h-3 w-5" />
            <div>
              <div className="font-semibold  text-lg">{successMsg}</div>
              <div className="text-sm opacity-95">Successfuly Logged out!.</div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="ml-auto bg-white/20 hover:bg-white/30 rounded-full h-8 w-8 text-xs font-semibold flex items-center justify-center shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      ));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location.state?.errorMessage,
    location.state?.successMessage,
    location.pathname,
    navigate,
  ]);

  // 💡 This is where you would put your Axios API call to FastAPI
  async function onSubmit(values) {
    // --- Example API Call (Uncomment and configure when ready) ---
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/login", values);
      localStorage.setItem("access_token", response.data.access_token);
      // Redirect user to login page or home page
      navigate("/", {
        state: {
          successMessage: "Welcome to Vibetube!",
          fromLogin: true,
        },
      });
    } catch (error) {
      // Handle error message and display to user
      setError(error.response.data.detail);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      {/* // Outer container for centering (from your original RegisterPage.jsx) */}
      <div className="bg-background flex w-full h-screen justify-center items-center">
        <div className="bg-muted h-fit p-7 rounded-2xl min-w-[400px]">
          {/* Inner Form Container (from your original Register.jsx) */}
          <div className="w-full max-w-sm">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-2 text-center">
                  <h1 className="font-bold text-2xl">Login to Vibetube</h1>
                  <p className="text-muted-foreground text-sm">
                    Sign in to your account
                  </p>
                </div>

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          placeholder="username"
                          {...field}
                          onClick={() => setError("")}
                        />
                      </FormControl>
                      <FormDescription className="text-red-600">
                        {Error === "username does not exists!" ? Error : ""}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          className="bg-background"
                          placeholder="Enter password"
                          type="password"
                          {...field}
                          onClick={() => setError("")}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-red-600">
                        {Error === "Incorrect password" ? Error : ""}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submission Button */}
                <Button className="w-full" type="submit">
                  {isLoading ? "Loading..." : "Login"}
                </Button>

                {/* Sign In Link */}
                <p className="text-center text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <a
                    className="hover:underline"
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
