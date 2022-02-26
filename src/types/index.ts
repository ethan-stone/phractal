import { Location } from "react-router-dom";

export interface ReactRouterLocation extends Location {
  state: {
    [k: string]: any;
  };
}

export type Note = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
};
