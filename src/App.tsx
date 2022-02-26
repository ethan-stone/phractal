import Amplify from "aws-amplify";
import AuthContext from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import Note from "./features/notes/Note";
import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import Notes from "./features/notes/Notes";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_qNofuAoRB",
    userPoolWebClientId: "28co5mi1ccqg4i6jeoavkjk5p0",
    identityPoolId: "us-east-1:678959f1-a721-4b84-b686-e823023ddbd4"
  }
});

function App() {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/notes" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/notes"
            element={
              <RequireAuth redirectTo="/signin">
                <Notes />
              </RequireAuth>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <RequireAuth redirectTo="/signin">
                <Note />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate replace to="/signin" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext>
  );
}

export default App;
