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

  const inputStyles =
    "p-2 m-2 rounded-md grow bg-neutral-800 focus:outline-none text-neutral-50 appearance-none";

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <NavBar />
      <div className="flex grow items-center justify-center">
        <div className="bg-neutral-900 rounded p-5 w-1/3 items-center justify-center">
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
                className="bg-neutral-50 text-neutral-800 p-2 rounded-md m-2 font-bold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
