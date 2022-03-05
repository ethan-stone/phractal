import { useState } from "react";
import { useFirebase } from "../../context/FirebaseContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";

type SignUpFormFields = {
  email: string;
  password: string;
};

type ConfirmFormFields = {
  code: string;
};

const SignUp: React.FC = () => {
  const { auth } = useFirebase();
  const [isUserSignedUp, setIsUserSignedUp] = useState<boolean>(false);
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean>(false);

  const navigate = useNavigate();

  const { register: signUpFormRegister, handleSubmit: signUpFormHandleSubmit } =
    useForm<SignUpFormFields>();

  const {
    register: confirmFormRegister,
    handleSubmit: confirmFormHandleSubmit
  } = useForm<ConfirmFormFields>();

  const onSubmitSignUp: SubmitHandler<SignUpFormFields> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setIsUserSignedUp(true);
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
          {!isUserSignedUp && !isUserConfirmed && (
            <form onSubmit={signUpFormHandleSubmit(onSubmitSignUp)}>
              <div className="grid grid-cols-1">
                <input
                  className={inputStyles}
                  placeholder={"example@email.com"}
                  type="email"
                  {...signUpFormRegister("email")}
                />
                <input
                  className={inputStyles}
                  placeholder={"password"}
                  type="password"
                  {...signUpFormRegister("password")}
                />
              </div>
              <div className="flex flex-col mt-4">
                <button
                  type="submit"
                  className="bg-gray-100 text-gray-500 p-2 mt-2 w-full rounded"
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

export default SignUp;
