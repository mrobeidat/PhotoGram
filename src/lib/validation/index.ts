import * as z from "zod";

export const SignupValidation = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name should only contain letters and spaces",
    })
    .min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username should only contain letters, numbers, and underscores",
    })
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    ),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
  // .min(8, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Caption must be at least 5 characters." })
    .max(2200, { message: "Caption can't exceed 2,200 characters" }),
  file: z.array(z.instanceof(File)).refine(files => files.length > 0, {
    message: "Please upload an image file",
  }),
  location: z
    .string()
    .min(1, { message: "Location field is required" })
    .max(1000, { message: "Location can't exceed 1000 characters." }),
  tags: z
    .string()
    .regex(/^[\w\s,]+$/, {
      message: "Tags should only contain letters, numbers, and spaces separated by commas",
    }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username should only contain letters, numbers, and underscores",
    })
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string().max(500, { message: "Bio can't exceed 500 characters" }),
});
