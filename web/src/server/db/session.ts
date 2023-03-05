import { db } from "./client";

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
};

type DbSession = Omit<Session, "id"> & { _id: string };

const sessionColl = db.collection<DbSession>("sessions");

function convertDbSessionToSession(dbSession: DbSession): Session {
  return {
    id: dbSession._id,
    expires: dbSession.expires,
    sessionToken: dbSession.sessionToken,
    userId: dbSession.userId,
  };
}

export type InsertSessionFn = (session: Session) => Promise<Session>;

export const insertSession: InsertSessionFn = async (session) => {
  const res = await sessionColl.insertOne({
    _id: session.id,
    userId: session.userId,
    expires: session.expires,
    sessionToken: session.sessionToken,
  });

  if (!res.acknowledged) {
    throw new Error(`Database insert not acknowledged`);
  }

  return session;
};

export type GetSessionBySessionTokenFn = (
  sessionToken: string
) => Promise<Session | null>;

export const getSessionBySessionToken: GetSessionBySessionTokenFn = async (
  sessionToken
) => {
  const session = await sessionColl.findOne({
    sessionToken: sessionToken,
  });

  return session && convertDbSessionToSession(session);
};

export type UpdateSessionBySessionTokenFn = (
  sessionToken: string,
  updates: Partial<Session>
) => Promise<Session | null>;

export const updateSessionBySessionToken: UpdateSessionBySessionTokenFn =
  async (sessionToken, updates) => {
    const res = await sessionColl.findOneAndUpdate(
      {
        sessionToken,
      },
      {
        $set: {
          expires: updates.expires,
          sessionToken: updates.sessionToken,
          userId: updates.userId,
        },
      }
    );

    if (!res.ok) console.error(`Database update not acknowledged`);

    return res.value && convertDbSessionToSession(res.value);
  };

export type DeleteSessionBySessionTokenFn = (
  sessionToken: string
) => Promise<Session | null>;

export const deleteSessionBySessionToken: DeleteSessionBySessionTokenFn =
  async (sessionToken) => {
    const res = await sessionColl.findOneAndDelete({
      sessionToken,
    });

    if (!res.ok) throw new Error(`Database delete not acknowledged`);

    return res.value && convertDbSessionToSession(res.value);
  };
