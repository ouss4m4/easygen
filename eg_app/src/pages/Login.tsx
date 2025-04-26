import { Link, Navigate } from "react-router";
import { LoginForm } from "../components/forms/login.form";
import { useAuth } from "@/context/AuthProvider";

export default function Login() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Navigate to="/" />;
  return (
    <div className="flex items-center justify-center shadow p-6 bg-white max-w-xl mx-auto">
      <div className="flex flex-col p-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        <LoginForm />
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? &nbsp;
          <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
            Signup Here
          </Link>
        </p>
      </div>
    </div>
  );
}
