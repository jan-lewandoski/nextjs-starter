import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "~/components/AuthLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import signUpSchema, {
  type SignUpSchemaType,
} from "~/schemas/auth/signUpSchema";

async function createAccount(body: SignUpSchemaType) {
  const response = await fetch("/api/auth/sign-up", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response.json()) as { message: string };

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data as unknown;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    values: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate } = useMutation(createAccount, {
    onSuccess: () => {
      void router.push({
        pathname: "/auth/sign-in",
      });
    },
    onError: () => {
      // TODO Handle error
    },
  });

  const onSubmit = (data: SignUpSchemaType) => mutate(data);

  return (
    <div className="mx-auto my-10 grid max-w-md rounded-lg p-4 shadow-md">
      <h1 className="text-center text-3xl text-gray-700">Create account</h1>
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
            <Input
              type="password"
              id="password"
              {...register("password")}
            />{" "}
            {errors.password ? (
              <p className="text-xs text-red-400">{errors.password.message}.</p>
            ) : null}
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full">
          Sign up
        </Button>
      </form>

      <span className="mt-8 flex w-fit justify-self-center text-center text-sm  text-gray-400">
        Already have an account?
        <Link
          href="/auth/sign-in"
          className="ml-1 flex w-fit justify-self-center text-center text-sm  text-sky-600 hover:text-sky-500"
        >
          Sign in
        </Link>
      </span>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/app/home",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
