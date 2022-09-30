import { useQuery } from "@tanstack/react-query";
import React, { createContext, useState } from "react";
import { useSupabase } from "./supabase";

type Profile = {
  uid: string;
  email: string;
};

type TProfileContext = {
  profile: Profile;
};

const ProfileContext = createContext<TProfileContext>({} as TProfileContext);

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
  const res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${uid}`, {
    mode: "cors",
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 404) return null;

  const json = (await res.json()) as { uid: string; email: string };

  return json;
};

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { supabase } = useSupabase();
  const { data } = useQuery(["profile"], async () => {});
};
