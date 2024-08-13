import { z } from "zod";

const requiredString = z.string().trim().min(1, "required");

export const signUpSchema = z.object({
  email: requiredString.email("invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only lettersm number, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be ata least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type loginValue = z.infer<typeof loginSchema>;

export const serverMemberSchema = z.object({
  userId: requiredString,
});

export const serverSchema = z.object({
  name: requiredString,
  description: z.string(),
});

export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "File size must be less than 1 MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG and PNG images are allowed",
    }),
});

export type ServerValue = z.infer<typeof serverSchema>;

export const profileSchema = z.object({
  displayName: requiredString,
  username: requiredString,
  discriminator: requiredString,
});

export type ProfileValue = z.infer<typeof profileSchema>;
