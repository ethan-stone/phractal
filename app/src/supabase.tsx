import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabase = createClient(
  "https://vrqmcxonzxysnukgreen.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycW1jeG9uenh5c251a2dyZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk5MDY3MjEsImV4cCI6MTk3NTQ4MjcyMX0.a_0Q-xGHcv20OiqbDNIMkMBdFRCWJz5mgLkYCnnJccs"
);

type TSupabaseContext = {
  isAuthed: boolean;
  supabase: SupabaseClient;
};

const SupabaseContext = createContext<TSupabaseContext>({} as TSupabaseContext);

type Props = {
  children: React.ReactElement;
};

export const SupabaseProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const session = supabase.auth.session();

    if (session) setIsAuthed(true);

    const { data, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          console.log("SIGNED_IN", session);
          setIsAuthed(true);
        }
        if (event === "SIGNED_OUT") {
          console.log("SIGNED_OUT", session);
          setIsAuthed(false);
        }
        setLoading(false);
      }
    );

    setLoading(false);

    return () => {
      data?.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ isAuthed, supabase }}>
      {loading ? (
        <div className="flex flex-col min-h-screen">
          <div className="flex grow justify-center items-center text-white text-2xl">
            Loading
          </div>
        </div>
      ) : (
        children
      )}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): TSupabaseContext => useContext(SupabaseContext);
