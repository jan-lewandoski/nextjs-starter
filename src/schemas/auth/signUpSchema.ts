import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export default signUpSchema;
