import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3).max(20),
    email: z.string().email("Email must be valid"),
    password: z
      .string()
      .min(8, "Password length must contain at least 8 characters")
      .max(100)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "Password must include a letter, number, and special character"
      ),
    password2: z
      .string()
      .min(8, "Password length must contain at least 8 characters")
      .max(100)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "Password must include a letter, number, and special character"
      ),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email must be valid"),
  password: z.string().min(1, "password is required").max(100),
});
