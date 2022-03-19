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

export interface Note {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
}

export interface NoteWithContent extends Note {
  content: string;
}
