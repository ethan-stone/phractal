import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";

type UserContextType = {
  user: CognitoUser | null;
  setUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

type Props = {
  children: React.ReactElement;
};

const AuthContext: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  const checkUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (cognitoUser) {
        setUser(cognitoUser);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => {
      checkUser();
    });
    return () => {
      Hub.remove("auth", () => {});
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;
export const useUser = (): UserContextType => useContext(UserContext);
