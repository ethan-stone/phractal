import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseProvider, useSupabase } from "./supabase";
import { Provider } from "@supabase/supabase-js";

const queryClient = new QueryClient();

function Home() {
  const { supabase } = useSupabase();

  const signIn = async (provider: Provider) => {
    await supabase.auth.signIn(
      {
        provider
      },
      {
        redirectTo: "http://localhost:5173"
      }
    );
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const buttonStyles = "p-2 rounded-md border-gray-500 border";

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!supabase.auth.session() ? (
        <div className="flex flex-col gap-2">
          <button
            className={buttonStyles}
            onClick={async () => await signIn("google")}
          >
            Sign In With Google
          </button>
          <button
            className={buttonStyles}
            onClick={async () => await signIn("github")}
          >
            Sign In With Github
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <p className="whitespace-pre-wrap break-words">
            {JSON.stringify(supabase.auth.session(), null, 2)}
          </p>
          <button
            className={buttonStyles}
            onClick={async () => await signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Home />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

export default App;
