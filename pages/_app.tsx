import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { trpc } from "../utils/trpc";

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<{ session: Session | null | undefined }>) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default trpc.withTRPC(MyApp);
