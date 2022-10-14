import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();
  if (!session.data)
    return (
      <div className="flex flex-col min-h-screen bg-neutral-800">
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
