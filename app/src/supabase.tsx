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

const createProfile = async (
  token: string,
  {
    uid,
    email
  }: {
    uid: string;
    email: string;
  }
) => {
  console.log(token);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      uid,
      email
    })
  });

  const json = (await res.json()) as { uid: string; email: string };

  return json;
};

const getProfile = async (
  token: string,
  {
    uid
  }: {
    uid: string;
  }
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${uid}`, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        uid
      })
    });

    console.log(res);

    const json = (await res.json()) as { uid: string; email: string };

    console.log(json);

    return json;
  } catch (error) {
    console.log(error);
  }
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
          createProfile(session?.access_token as string, {
            uid: session?.user?.id as string,
            email: session?.user?.email as string
          }).then((profile) => {});
          console.log("SIGNED_IN", session);
        }
        if (event === "SIGNED_OUT") {
          setIsAuthed(false);
          console.log("SIGNED_OUT", session);
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
