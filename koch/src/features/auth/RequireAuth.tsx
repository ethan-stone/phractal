import { useFirebase } from "../../context/FirebaseContext";
import { Navigate, useLocation } from "react-router-dom";
import {
  redirectToAuth,
  ThirdPartyEmailPasswordAuth
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { useEffect, useState } from "react";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

type Props = {
  children: React.ReactElement;
  redirectTo: string;
};

const RequireAuth: React.FC<Props> = ({ children, redirectTo }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  useEffect(() => {
    doesSessionExist().then((isSession) => setIsSignedIn(isSession));
  }, []);

  const location = useLocation();

  return isSignedIn ? (
    <ThirdPartyEmailPasswordAuth
      requireAuth={true}
      onSessionExpired={redirectToAuth}
    >
      {children}
    </ThirdPartyEmailPasswordAuth>
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
};

export default RequireAuth;
