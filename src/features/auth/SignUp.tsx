import { useState } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
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
  const [user, setUser] = useState<CognitoUser | null>(null);
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
      const signUpResult = await Auth.signUp({
        username: data.email,
        password: data.password
      });

      setUser(signUpResult.user);
      setIsUserSignedUp(true);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitConfirm: SubmitHandler<ConfirmFormFields> = async (data) => {
    try {
      if (!user) throw new Error("There was an error confirming your identity");
      await Auth.confirmSignUp(user.getUsername(), data.code);

      navigate("/signin");
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
          {isUserSignedUp && !isUserConfirmed && (
            <form onSubmit={confirmFormHandleSubmit(onSubmitConfirm)}>
              <div className="grid grid-cols-1">
                <input
                  className={inputStyles}
                  placeholder={"123456"}
                  type="text"
                  {...confirmFormRegister("code")}
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
