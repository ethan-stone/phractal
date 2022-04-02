export type AuthorizerClaims = {
  aud: string;
  auth_time: string;
  email: string;
  email_verified: "true" | "false";
  exp: string;
  firebase: string;
  iat: string;
  iss: string;
  sub: string;
  user_id: string;
};

export type EmptyObject = Record<string, never>;

export {
  Note,
  ApiKey,
  Permission,
  User,
  Visibility,
  Role
} from "@prisma/client";

import { Note } from "@prisma/client";

export type NoteWithContent = Note & { content: string };
