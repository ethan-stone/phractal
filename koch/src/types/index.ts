import { Location } from "react-router-dom";

export type SuccessResponseBody<T> = {
  data?: T;
};

export type ErrorResponseBody<T> = {
  error?: T;
};

export type ResponseBody<A = {}, B = {}> = SuccessResponseBody<A> &
  ErrorResponseBody<B>;

export interface ReactRouterLocation extends Location {
  state: {
    [k: string]: any;
  };
}

export type TagData = {
  name: string;
};

export type Tag = {
  tag: TagData;
};

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

export interface Note {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  visibility: Visibility;
  content?: string;
  NoteTagJunction?: Array<Tag>;
  createdAt: string;
  updatedAt: string;
}
