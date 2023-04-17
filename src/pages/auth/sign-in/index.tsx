import type { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Text,
  Container,
  Button,
  Title,
  Stack,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import signInSchema, { type SignIn } from "~/schemas/auth/signInSchema";
import AuthLayout from "~/components/AuthLayout";
import { type ReactElement } from "react";

export default function SignInPage({
  csrfToken,
  email,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const form = useForm<SignIn>({
    validate: zodResolver(signInSchema),
    initialValues: {
      email: email ?? "",
      password: "",
      csrfToken: csrfToken ?? "",
    },
  });

  return (
    <Container size={420} my={40}>
      <Paper shadow="md" p={30} mt={30} radius="md">
        <Title order={3} align="center" mb={12}>
          Welcome back
        </Title>
        <form
          onSubmit={form.onSubmit(({ email, password }) => {
            void signIn("credentials", {
              email,
              password,
            });
          })}
        >
          <Stack spacing={12}>
            <TextInput
              label="Email"
              withAsterisk
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              withAsterisk
              mt="md"
              {...form.getInputProps("password")}
            />
          </Stack>

          <Button fullWidth mt={24} type="submit">
            Sign in
          </Button>
          <Flex mt={24} justify="center">
            <Anchor component="button" size="sm">
              Forgot password
            </Anchor>
          </Flex>
        </form>

        <Text color="dimmed" size="sm" align="center" mt={32}>
          Don&apos;t have an account yet?
          <Anchor ml={4} component={Link} href="/auth/sign-up" size="sm">
            Sign up
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
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
