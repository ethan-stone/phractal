import { type Collection, type Filter, type Db } from "mongodb";
import { type Note } from "../domain/note";
import { type Page } from "./common";
import { uid } from "../utils/uid";
import { type Overwrite } from "../utils/types";
import { db } from "../db/client";

export interface INotesRepo {
  insert(note: Omit<Note, "id">): Promise<Note>;
  updateById(id: string, updates: Partial<Note>): Promise<Note | null>;
  getByIdAndUserId(id: string, userId: string): Promise<Note | null>;
  paginateByUserIdAndUpdatedAt(args: {
    userId: string;
    limit: number;
    startingAfter?: string;
  }): Promise<Page<Note>>;
}

export type DbNote = Omit<
  Overwrite<
    Note,
    {
      _id: string;
    }
  >,
  "id"
>;

export class NotesRepo implements INotesRepo {
  private notes: Collection<DbNote>;
  private getUID: (args?: { prefix: string }) => string;

  constructor(private db: Db) {
    this.notes = this.db.collection<DbNote>("notes");
    this.getUID = uid;
  }

  private getNoteUID(): string {
    return this.getUID({ prefix: "note" });
  }

  private fromDbToDomain(note: DbNote): Note {
    return {
      id: note._id,
      content: note.content,
      name: note.name,
      userId: note.userId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  private fromDomainToDb(note: Note): DbNote {
    return {
      _id: note.id,
      content: note.content,
      name: note.name,
      userId: note.userId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  async insert(note: Omit<Note, "id">): Promise<Note> {
    const _id = this.getNoteUID();

    await this.notes.insertOne(this.fromDomainToDb({ ...note, id: _id }));

    return this.fromDbToDomain({
      _id,
      ...note,
    });
  }

  async updateById(id: string, updates: Partial<Note>): Promise<Note | null> {
    const res = await this.notes.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content: updates.content,
          name: updates.name,
          updatedAt: updates.updatedAt,
          userId: updates.userId,
        },
      }
    );

    if (!res.value) return null;

    return this.fromDbToDomain(res.value);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Note | null> {
    const res = await this.notes.findOne({ _id: id, userId });

    if (!res) return null;

    return this.fromDbToDomain(res);
  }

  async paginateByUserIdAndUpdatedAt(args: {
    userId: string;
    limit: number;
    startingAfter?: string;
  }): Promise<Page<Note>> {
    let filter: Filter<DbNote> = { userId: args.userId };

    if (args.startingAfter) {
      const startingAfterItem = await this.notes.findOne({
        _id: args.startingAfter,
      });

      if (!startingAfterItem)
        throw new Error(
          `No startingAfter item with id: ${args.startingAfter} found`
        );

      // TODO: understand why this query is the correct one?
      filter = {
        ...filter,
        $or: [
          {
            updatedAt: { $lt: startingAfterItem.updatedAt },
          },
          {
            updatedAt: startingAfterItem.updatedAt,
            _id: { $gt: startingAfterItem._id },
          },
        ],
      };
    }

    const cursor = this.notes.find(filter, {
      limit: args.limit + 1,
      sort: {
        updatedAt: "desc",
        _id: "asc",
      },
    });

    const items = await cursor.toArray();

    return {
      hasMore: items.length > args.limit,
      items:
        items.length > args.limit
          ? items.slice(0, -1).map((dbNote) => ({
              id: dbNote._id,
              content: dbNote.content,
              name: dbNote.name,
              userId: dbNote.userId,
              createdAt: dbNote.createdAt,
              updatedAt: dbNote.updatedAt,
            }))
          : items.map((dbNote) => ({
              id: dbNote._id,
              content: dbNote.content,
              name: dbNote.name,
              userId: dbNote.userId,
              createdAt: dbNote.createdAt,
              updatedAt: dbNote.updatedAt,
            })),
    };
  }
}

export const notesRepo = new NotesRepo(db);
