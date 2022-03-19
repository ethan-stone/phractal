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
