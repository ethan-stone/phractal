import { useFirebase } from "../../context/FirebaseContext";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactElement;
  redirectTo: string;
};

const RequireAuth: React.FC<Props> = ({ children, redirectTo }) => {
  const { user } = useFirebase();

  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
};

export default RequireAuth;
