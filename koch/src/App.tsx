import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import Note from "./features/notes/Note";
import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import Notes from "./features/notes/Notes";
import * as reactRouterDom from "react-router-dom";
import SuperTokens, {
  getSuperTokensRoutesForReactRouterDom
} from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword, {
  redirectToAuth,
  ThirdPartyEmailPasswordAuth
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";

SuperTokens.init({
  appInfo: {
    appName: "phractal-dev",
    apiDomain: "http://localhost:8080",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/v1/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      signInAndUpFeature: {
        providers: []
      }
    }),
    Session.init({
      onHandleEvent: async (context) => {
        if (context.action === "SIGN_OUT") {
          await redirectToAuth();
        }
      }
    })
  ],
  enableDebugLogs: true // TODO: disable in production
});

function App() {
  return (
    <Routes>
      {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
      <Route path="/" element={<Navigate replace to="/notes" />} />
      <Route
        path="/notes"
        element={
          <ThirdPartyEmailPasswordAuth
            requireAuth={true}
            onSessionExpired={redirectToAuth}
          >
            <Notes />
          </ThirdPartyEmailPasswordAuth>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <ThirdPartyEmailPasswordAuth
            requireAuth={true}
            onSessionExpired={redirectToAuth}
          >
            <Note />
          </ThirdPartyEmailPasswordAuth>
        }
      />
      <Route path="*" element={<Navigate replace to="/auth" />} />
    </Routes>
  );
}

export default App;
