import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext";
import { signOut } from "firebase/auth";

const NavBar: React.FC = () => {
  const { auth, user } = useFirebase();
  const navigate = useNavigate();

  const navLinkStyles = "mx-2";
  return (
    <nav className="border-b-2 border-gray-800 p-3">
      {!user ? (
        <button className={navLinkStyles} onClick={() => navigate("/signin")}>
          Sign In
        </button>
      ) : (
        <button className={navLinkStyles} onClick={() => signOut(auth)}>
          Logout
        </button>
      )}
      <Link className={navLinkStyles} to="/notes">
        Notes
      </Link>
    </nav>
  );
};

export default NavBar;
