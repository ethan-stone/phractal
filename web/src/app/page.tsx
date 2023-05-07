"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <div className="flex items-center justify-center">
          <UserButton />
        </div>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-200">
      <div className="container flex flex-grow flex-col items-center justify-center">
        <AuthShowcase />
        <Link href="/notes">/notes</Link>
      </div>
    </main>
  );
}
