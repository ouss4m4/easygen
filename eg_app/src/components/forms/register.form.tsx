"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/auth.schema";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password2: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("root", data.message ? { message: data.message } : { message: "Error registering" });
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
      setError("root", { message: "An unexpected error occurred" });
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-y-3">
          <div className="grid gap-1">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input id="name" placeholder="name" type="text" {...register("name")} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
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
              <Input id="password" placeholder="password" type="password" {...register("password")} />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>

            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password2">
                Confirm Password
              </Label>
              <Input id="password2" placeholder="confirm password" type="password" {...register("password2")} />
              {errors.password2 && <span className="text-xs text-red-500">{errors.password2.message}</span>}
            </div>
            <Button disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Create Account"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
