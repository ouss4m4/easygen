import { Link } from "react-router";
import { RegisterForm } from "../components/forms/register.form";

export default function Register() {
  return (
    <div className="flex items-center justify-center shadow p-6 bg-white max-w-xl mx-auto">
      <div className="flex flex-col p-6 w-96">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <RegisterForm />
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Already have an account? &nbsp;
          <Link to="/login" className="underline underline-offset-4 hover:text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
