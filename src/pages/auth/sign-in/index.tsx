import type { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { type ReactElement } from "react";
import AuthLayout from "~/components/AuthLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import signInSchema, {
  type SignInSchemaType,
} from "~/schemas/auth/signInSchema";

export default function SignInPage({
  csrfToken,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    values: {
      csrfToken,
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }: SignInSchemaType) =>
    signIn("credentials", {
      email,
      password,
    });

  return (
    <div className="mx-auto my-10 grid max-w-md rounded-lg p-4 shadow-md">
      <h1 className="text-center text-3xl text-gray-700">Welcome back</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 grid items-center gap-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-red-400">{errors.email.message}.</p>
            ) : null}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" {...register("password")} />
            {errors.password ? (
              <p className="text-xs text-red-400">{errors.password.message}.</p>
            ) : null}
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full">
          Sign in
        </Button>
      </form>
      <Link
        href="/auth/forgot-password"
        className="mt-4 flex w-fit justify-self-center text-center text-sm  text-sky-600 hover:text-sky-500"
      >
        Forgot password
      </Link>

      <span className="mt-8 flex w-fit justify-self-center text-center text-sm  text-gray-400">
        Don&apos;t have an account?
        <Link
          href="/auth/sign-up"
          className="ml-1 flex w-fit justify-self-center text-center text-sm  text-sky-600 hover:text-sky-500"
        >
          Sign up
        </Link>
      </span>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        csrfToken: (await getCsrfToken(context)) || "",
        email: (context.query.email as string) || null,
      },
    };
  }

  return {
    redirect: {
      destination: "/app",
      permanent: false,
    },
  };
}

SignInPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
