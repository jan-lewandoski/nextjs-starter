import { z } from "zod";

const signInSchema = z.object({
  csrfToken: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignIn = z.infer<typeof signInSchema>;

export default signInSchema;
