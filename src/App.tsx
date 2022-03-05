import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import Note from "./features/notes/Note";
import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import Notes from "./features/notes/Notes";

function App() {
  return (
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
  );
}

export default App;
