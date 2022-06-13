import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseContext";
import {
  doesSessionExist,
  signOut,
  useSessionContext
} from "supertokens-auth-react/recipe/session";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
  const { doesSessionExist } = useSessionContext();

  const navigate = useNavigate();

  const navLinkStyles = "mx-2";
  return (
    <nav className="bg-neutral-800 border-b-2 border-neutral-900 p-3 text-white">
      {!doesSessionExist ? (
        <>
          <button className={navLinkStyles} onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button className={navLinkStyles} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </>
      ) : (
        <button className={navLinkStyles} onClick={async () => await signOut()}>
          Logout
        </button>
      )}
      {doesSessionExist && (
        <Link className={navLinkStyles} to="/notes">
          Notes
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
