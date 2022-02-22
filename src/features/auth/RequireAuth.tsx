import { useUser } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactElement;
  redirectTo: string;
};

const RequireAuth: React.FC<Props> = ({ children, redirectTo }) => {
  const { user } = useUser();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
};

export default RequireAuth;
