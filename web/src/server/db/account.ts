import { db } from "./client";

export type Account = {
  id: string;
  userId: string;
  type: "email" | "oauth" | "credentials";
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
};

type DbAccount = Omit<Account, "id"> & { _id: string };

const accountColl = db.collection<DbAccount>("accounts");

function convertDbAccountToAccount(dbAccount: DbAccount): Account {
  return {
    id: dbAccount._id,
    provider: dbAccount.provider,
    providerAccountId: dbAccount.providerAccountId,
    type: dbAccount.type,
    userId: dbAccount.userId,
    access_token: dbAccount.access_token,
    expires_at: dbAccount.expires_at,
    id_token: dbAccount.id_token,
    refresh_token: dbAccount.id_token,
    scope: dbAccount.scope,
    session_state: dbAccount.session_state,
    token_type: dbAccount.token_type,
  };
}

type GetAccountByProviderAndProviderAccountIdFn = (
  providerAccountId: string,
  provider: string
) => Promise<Account | null>;

export const getAccountByProviderAndProviderAccountId: GetAccountByProviderAndProviderAccountIdFn =
  async (providerAccountId, provider) => {
    const account = await accountColl.findOne({
      provider,
      providerAccountId,
    });

    return account && convertDbAccountToAccount(account);
  };

type InsertAccountFn = (account: Account) => Promise<Account>;

export const insertAccount: InsertAccountFn = async (account) => {
  const res = await accountColl.insertOne({
    _id: account.id,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    type: account.type,
    userId: account.userId,
    access_token: account.access_token,
    expires_at: account.expires_at,
    id_token: account.id_token,
    refresh_token: account.id_token,
    scope: account.scope,
    session_state: account.session_state,
    token_type: account.token_type,
  });

  if (!res.acknowledged) {
    throw new Error(`Database insert not acknowledged`);
  }

  return account;
};
