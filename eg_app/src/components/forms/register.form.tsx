import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/auth.schema";
import { api } from "@/api/api";
import { RegisterResponse } from "@/api/typings";
import { redirect } from "react-router";

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
      await api<RegisterResponse>("POST", "/users", { body: values });
      redirect("/login");
    } catch (error) {
      let message = "An unexpected error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      setError("root", { message });
    }
  }

  return (
    <div className="relative pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
        <div className="grid gap-y-3 ">
          <div className="relative pb-5 grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input id="name" placeholder="name" type="text" {...register("name")} />
            <div className="absolute -bottom-2">{errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}</div>
          </div>

          <div className="relative pb-5 grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input id="email" placeholder="name@example.com" type="email" {...register("email")} />
            <div className="absolute -bottom-2">{errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}</div>
          </div>
          <div className="relative pb-5 grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input id="password" placeholder="password" type="password" {...register("password")} />
            <div className="absolute -bottom-2">
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
          </div>

          <div className="relative pb-5 grid gap-1">
            <Label className="sr-only" htmlFor="password2">
              Confirm Password
            </Label>
            <Input id="password2" placeholder="confirm password" type="password" {...register("password2")} />
            <div className="absolute -bottom-2">
              {errors.password2 && <span className="text-xs text-red-500">{errors.password2.message}</span>}
            </div>
          </div>
          <Button disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Create Account"}</Button>
          {errors.root && <span className="text-sm text-red-500">{errors.root.message}</span>}
        </div>
      </form>
    </div>
  );
}
