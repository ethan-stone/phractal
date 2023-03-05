import { type VerificationToken } from "@/server/domain/verification-token";
import { db } from "./client";

type DbVerificationToken = VerificationToken;

const verificationTokenColl =
  db.collection<DbVerificationToken>("verificationTokens");

export type InsertVerificationTokenFn = (
  verificationToken: VerificationToken
) => Promise<VerificationToken>;

export const insertVerificationToken: InsertVerificationTokenFn = async (
  verificationToken
) => {
  await verificationTokenColl.insertOne(verificationToken);

  return verificationToken;
};

export type DeleteVerificationTokenByIdentifierAndTokenFn = (
  identifier: string,
  token: string
) => Promise<DbVerificationToken | null>;

export const deleteVerificationTokenByIdentifierAndToken: DeleteVerificationTokenByIdentifierAndTokenFn =
  async (identifier, token) => {
    const res = await verificationTokenColl.findOneAndDelete({
      identifier,
      token,
    });

    return res.value;
  };
