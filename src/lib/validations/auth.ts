import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
const safaricomRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required to sign up." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*).",
    }),

  phone: z
    .string()
    .min(1, { message: "Phone number is required for M-Pesa payments." })
    .regex(safaricomRegex, {
      message:
        "Please enter a valid Safaricom phone number (e.g., 0712345678 or +254...).",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required to log in." })
    .email({ message: "Please provide a valid email address." }),

  password: z.string().min(1, { message: "Password is required to log in." }),
});
