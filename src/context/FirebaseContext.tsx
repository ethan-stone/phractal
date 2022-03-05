import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  getIdToken as _getIdToken,
  User,
  Auth
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCIbMfVJeggro5kFu_JRoXoUH2a6Pvnogw",
  authDomain: "phractal-dev.firebaseapp.com",
  projectId: "phractal-dev",
  appId: "1:716270284023:web:5353661c5bf7ad0fb437f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type FirebaseContextType = {
  user: User | null;
  auth: Auth;
  getIdToken: () => Promise<string>;
};

const FirebaseContext = createContext<FirebaseContextType>(
  {} as FirebaseContextType
);

type Props = {
  children: React.ReactElement;
};

const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getIdToken = useCallback(() => {
    return _getIdToken(user as User);
  }, [user]);

  return (
    <FirebaseContext.Provider value={{ user, auth, getIdToken }}>
      {loading ? (
        <div className="flex flex-col min-h-screen bg-gray-700">
          <div className="flex grow justify-center items-center text-white text-2xl">
            Loading
          </div>
        </div>
      ) : (
        children
      )}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
export const useFirebase = (): FirebaseContextType =>
  useContext(FirebaseContext);
