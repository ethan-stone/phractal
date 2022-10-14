export type Query<T> = Partial<T>;

export type InsertInput<T> = Omit<T, "id">;

export interface Repo<T> {
  insertOne(entity: InsertInput<T>): Promise<T>;
  findOne(filter: Query<T>): Promise<T | undefined>;
  updateOne(filter: Query<T>): Promise<T>;
}
