import * as functions from "firebase-functions";
import axios from "axios";

const apiUrl = functions.config().api.url as string;
const apiKey = functions.config().api.key as string;

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const url = `${apiUrl}/users` as string;

  try {
    await axios({
      method: "POST",
      url: url,
      data: {
        id: user.uid,
        email: user.email
      },
      headers: {
        "x-api-key": apiKey
      }
    });
    return {};
  } catch (error) {
    return {};
  }
});
