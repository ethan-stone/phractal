import { type Adapter } from "next-auth/adapters";
import {} from "@/server/db/client";
import {
  getUserByEmail,
  getUserById,
  insertUser,
  updateUserById,
} from "@/server/db/user";
import { createId } from "@paralleldrive/cuid2";
import {
  getAccountByProviderAndProviderAccountId,
  insertAccount,
} from "@/server/db/account";
import {
  deleteSessionBySessionToken,
  getSessionBySessionToken,
  insertSession,
  updateSessionBySessionToken,
} from "@/server/db/session";
import {
  deleteVerificationTokenByIdentifierAndToken,
  insertVerificationToken,
} from "@/server/db/verificationToken";

export function AuthAdapter(): Adapter {
  return {
    async createUser(user) {
      return insertUser({
        id: createId(),
        ...user,
      });
    },
    async getUser(id) {
      return getUserById(id);
    },
    async getUserByEmail(email) {
      return getUserByEmail(email);
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await getAccountByProviderAndProviderAccountId(
        providerAccountId,
        provider
      );

      if (!account) return null;

      return getUserById(account.userId);
    },
    async updateUser(updates) {
      if (!updates.id) throw new Error("No id can't update");

      const user = await updateUserById(updates.id, updates);

      if (!user) throw new Error(`User with id: ${updates.id} not found`);

      return user;
    },
    async linkAccount(account) {
      return insertAccount({
        id: createId(),
        ...account,
      });
    },
    async createSession(session) {
      return insertSession({
        id: createId(),
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: session.userId,
      });
    },
    async getSessionAndUser(sessionToken) {
      const session = await getSessionBySessionToken(sessionToken);

      if (!session) return null;

      const user = await getUserById(session.userId);

      if (!user) return null;

      return {
        session,
        user,
      };
    },
    async updateSession(updates) {
      if (!updates.sessionToken) throw new Error("No id can't update");

      const session = await updateSessionBySessionToken(
        updates.sessionToken,
        updates
      );

      return session;
    },
    async deleteSession(sessionToken) {
      const session = await deleteSessionBySessionToken(sessionToken);
      if (!session)
        throw new Error(`Session for sessionToken: ${sessionToken} not found`);
      return session;
    },
    async createVerificationToken(verificationToken) {
      return insertVerificationToken(verificationToken);
    },
    async useVerificationToken({ identifier, token }) {
      return deleteVerificationTokenByIdentifierAndToken(identifier, token);
    },
  };
}
