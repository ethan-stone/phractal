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
  Role,
  NodeKind
} from "@prisma/client";
