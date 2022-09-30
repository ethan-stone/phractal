import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
};

export default Home;
