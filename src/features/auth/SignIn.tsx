import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "../../context/FirebaseContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactRouterLocation } from "../../types";
import NavBar from "../common/NavBar";

type SignInFormFields = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const { register, handleSubmit } = useForm<SignInFormFields>();
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();
  const { auth } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit: SubmitHandler<SignInFormFields> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      const { state } = location as ReactRouterLocation;

      if (state?.from) {
        navigate(state.from);
      } else {
        navigate("/notes");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const inputStyles = "p-2 my-2 rounded";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <div className="flex grow items-center justify-center">
        <div className="bg-gray-500 rounded p-5 w-1/3 items-center justify-center">
          {!isUserSignedIn && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1">
                <input
                  className={inputStyles}
                  placeholder={"example@email.com"}
                  type="text"
                  {...register("email")}
                />
                <input
                  className={inputStyles}
                  placeholder={"password"}
                  type="password"
                  {...register("password")}
                />
              </div>
              <div className="flex flex-col mt-4">
                <button
                  type="submit"
                  className="bg-gray-100 text-gray-500 p-2 mt-2 w-full rounded"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="bg-gray-500 border-2 border-white text-white p-2 mt-2 w-full rounded"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
