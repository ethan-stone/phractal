import { Location } from "react-router-dom";

export interface ReactRouterLocation extends Location {
  state: {
    [k: string]: any;
  };
}
