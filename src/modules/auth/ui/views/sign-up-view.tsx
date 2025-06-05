"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Github, OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaGithub, FaGoogle } from "react-icons/fa";

const formSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().min(2).email("Invalid email address"),
    password: z.string().min(1, "Password must be required"),
    confirmPassword: z.string().min(1, "Confirm Password must be required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUpView() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onRequest: (ctx: any) => {
          // Handle request
        },
        onSuccess: (ctx: any) => {
          // Handle success
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          // Handle error
          setPending(false);
          setError(error.message);
        },
      }
    );
  };


  const socialLogin = async (provider: "github" | "google") => {
      const data = await authClient.signIn.social(
        {
          provider: provider,
          callbackURL:"/"
        },
        {
         
          onSuccess: (ctx: any) => {
            // Handle success
            setPending(false);
          
          },
          onError: ({ error }) => {
            // Handle error
            setPending(false);
            setError(error.message);
          },
        }
      );
    };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center justify-center ">
                  <h1 className="text-2xl text-bold">Let&apos;s Get Started</h1>
                  <p className="text-muted-foreground text-balance ">
                    Create your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="John Doe"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder="m@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="*********"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="*********"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />

                    <AlertTitle className="">{error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full cursor-pointer"
                >
                  Sign Up
                </Button>
                <div className="relative text-sm flex justify-center items-center text-center after:content-[''] after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card relative px-2 z-10 text-muted-foreground">
                    Or Continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    disabled={pending}
                    variant={"outline"}
                    className="w-full cursor-pointer"
                    type="button"
                    onClick={() => socialLogin("google")}
                  >
                    <FaGoogle/>
                  </Button>
                  <Button
                    disabled={pending}
                    variant={"outline"}
                    className="w-full cursor-pointer"
                    type="button"
                    onClick={() => socialLogin("github")}
                  >
                    <FaGithub/>
                  </Button>
                </div>
                <div className="text-sm  text-center">
                  YOu have an account?{" "}
                  <Link
                    href={"/sign-in"}
                    className="underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-green-700 to bg-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="meet ai" className="h-[90px] w-[90px]" />
            <p className="font-semibold text-white text-2xl">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of services</a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}

export default SignUpView;
