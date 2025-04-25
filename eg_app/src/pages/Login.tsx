import { LoginForm } from "../components/forms/login.form";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        <LoginForm />
      </div>
    </div>
  );
}
