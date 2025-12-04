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

// We will use Axios here for the actual API call (you'll need to install it: npm install axios)
// import axios from "axios";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
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
      email: "",
      password: "",
    },
  });

  // 💡 This is where you would put your Axios API call to FastAPI
  async function onSubmit(values) {
    console.log("Form submitted with values:", values);

    // --- Example API Call (Uncomment and configure when ready) ---

    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        values
      );
      console.log("Registration successful!", response.data);
      // Redirect user to login page or home page
      navigate("/login");
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
      <div className="bg-muted h-fit p-7 rounded-2xl">
        {/* Inner Form Container (from your original Register.jsx) */}
        <div className="w-full max-w-sm min-w-[360px]">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2 text-center">
                <h1 className="font-bold text-2xl">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                  Sign up to get started with our platform
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

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="you@example.com"
                        type="email"
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
                        placeholder="Create a strong password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Must contain uppercase, lowercase, and number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submission Button */}
              <Button className="w-full" type="submit">
                Create Account
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-muted-foreground text-sm">
                Already have an account?{" "}
                <a
                  className="hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Sign in
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
