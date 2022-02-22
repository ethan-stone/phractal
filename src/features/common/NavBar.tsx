import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  const navLinkStyles = "mx-2";
  return (
    <nav className="border-b-2 border-black p-3">
      <Link className={navLinkStyles} to="/signin">
        Sign In
      </Link>
      <Link className={navLinkStyles} to="/signup">
        Sign Up
      </Link>
      <Link className={navLinkStyles} to="/notes">
        Notes
      </Link>
      <Link className={navLinkStyles} to="/note">
        Note
      </Link>
    </nav>
  );
};

export default NavBar;
