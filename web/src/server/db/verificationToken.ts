import { db } from "./client";

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Date;
};

type DbVerificationToken = VerificationToken;

const verificationTokenColl =
  db.collection<DbVerificationToken>("verificationTokens");

export type InsertVerificationTokenFn = (
  verificationToken: VerificationToken
) => Promise<VerificationToken>;

export const insertVerificationToken: InsertVerificationTokenFn = async (
  verificationToken
) => {
  const res = await verificationTokenColl.insertOne(verificationToken);

  if (!res.acknowledged) {
    throw new Error(`Database insert not acknowledged`);
  }

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

    if (!res.ok) throw new Error(`Database delete not acknowledged`);

    return res.value;
  };
