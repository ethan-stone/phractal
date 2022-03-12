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

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<SignUpFormFields>();

  const onSubmitSignUp: SubmitHandler<SignUpFormFields> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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
          <form onSubmit={handleSubmit(onSubmitSignUp)}>
            <div className="grid grid-cols-1">
              <input
                className={inputStyles}
                placeholder={"example@email.com"}
                type="email"
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
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
