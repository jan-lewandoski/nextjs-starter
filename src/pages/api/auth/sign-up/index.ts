import { type NextApiRequest, type NextApiResponse } from "next";
import signUpSchema, {
  type SignUpSchemaType,
} from "~/schemas/auth/signUpSchema";
import { prisma } from "~/server/db";
import { hashSync } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { success } = signUpSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Invalid body" });
    }

    const { email, password } = req.body as SignUpSchemaType;

    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const createdUser = await prisma.user.create({
      data: { email, passwordHash: hashSync(password, 10) },
      select: { email: true },
    });

    return res.status(201).json(createdUser);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
