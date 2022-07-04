import type { NextPage } from "next";
import Editor from "../components/Editor";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <div className="flex grow">
        <div className="flex-[0_0_25%]" />
        <Editor />
        <div className="flex-[0_0_25%]" />
      </div>
    </div>
  );
};

export default Home;
