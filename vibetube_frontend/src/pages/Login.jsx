"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 💡 This is where you would put your Axios API call to FastAPI
  async function onSubmit(values) {
    // --- Example API Call (Uncomment and configure when ready) ---
    try {
      const response = await axios.post("http://localhost:8000/login", values);
      console.log("Registration successful!", response.data);
      localStorage.setItem("access_token", response.data.access_token);
      // Redirect user to login page or home page
      // navigate("/login");
    } catch (error) {
      // Handle error message and display to user
      console.error("Registration failed:", error.response.data.detail);
      // setFormError(error.response.data.detail);
    }
  }

  const navigate = useNavigate();

  return (
    // Outer container for centering (from your original RegisterPage.jsx)
    <div className="bg-background flex w-full h-screen justify-center items-center">
      <div className="bg-muted h-fit p-7 rounded-2xl min-w-[400px]">
        {/* Inner Form Container (from your original Register.jsx) */}
        <div className="w-full max-w-sm">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                      />
                    </FormControl>
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
                        className="bg-background"
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Case Sensitive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submission Button */}
              <Button className="w-full" type="submit">
                Login
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
  );
};

export default RegisterPage;
