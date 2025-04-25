import { RegisterForm } from "../components/forms/register.form";

export default function Register() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
