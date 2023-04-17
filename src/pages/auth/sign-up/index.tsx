import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Anchor,
  Stack,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactElement } from "react";
import AuthLayout from "~/components/AuthLayout";
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
  const form = useForm<SignUpSchemaType>({
    validate: zodResolver(signUpSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate, isLoading } = useMutation(createAccount, {
    onSuccess: () => {
      void router.push({
        pathname: "/auth/sign-in",
      });
    },
    onError: () => {
      // TODO Handle error
    },
  });

  return (
    <Container size={420} my={40}>
      <Paper shadow="md" p={30} mt={30} radius="md">
        <Title order={3} align="center" mb={12}>
          Create an account
        </Title>
        <form
          onSubmit={form.onSubmit((values) => {
            mutate(values);
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
          <Button fullWidth mt={24} type="submit" loading={isLoading}>
            Sign up
          </Button>
        </form>

        <Stack mt={32}>
          <Text color="dimmed" size="sm" align="center">
            Already have an account?
            <Anchor ml={4} component={Link} href="/auth/sign-in" size="sm">
              Sign in
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
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
