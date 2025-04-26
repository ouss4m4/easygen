import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/auth.schema";
import { api } from "@/api/api";
import { LoginResponse } from "@/api/typings";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      const response = await api<LoginResponse>("POST", "/auth/login", { body: values }, false);
      login(response.accessToken);
      navigate("/profile");
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
      <div className="absolute top-0">{errors.root && <span className="text-sm text-red-500">{errors.root.message}</span>}</div>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
        <div className="grid gap-y-3">
          <div className="relative pb-5 grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input id="email" placeholder="name@example.com" type="email" {...register("email")} />
            <div className="absolute -bottom-2">{errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}</div>
          </div>
          <div className="relative pb-5 grid gap-y-3">
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
              {...register("password")}
            />
            <div className="absolute -bottom-2">
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
