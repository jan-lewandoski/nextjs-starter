import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { type NextPage } from "next";
import { type ReactElement, type ReactNode } from "react";
import "~/styles/globals.css";

//eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
