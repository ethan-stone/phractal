import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryWrapper from "@/components/react-query-wrapper";

import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryWrapper>
      <ClerkProvider>{children}</ClerkProvider>;
    </ReactQueryWrapper>
  );
}
