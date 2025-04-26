"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/auth.schema";
import { api } from "@/api/api";
import { LoginResponse } from "@/api/typings";
import { redirect } from "react-router";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await api<LoginResponse>("POST", "/auth/login", { body: values });
      localStorage.setItem("accessToken", response.accessToken);
      redirect("/profile");
    } catch (error) {
      let message = "An unexpected error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      setError("root", { message });
    }
  }

  return (
    <div className="grid gap-6">
      {errors.root && <span className="text-red-500">{errors.root.message}</span>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-y-3">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input id="email" placeholder="name@example.com" type="email" {...register("email")} />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("password")} // Fixed the name
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
