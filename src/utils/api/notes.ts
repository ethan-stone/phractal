import { CognitoUser } from "@aws-amplify/auth";
import { ResponseBody, Note, NoteWithContent } from "../../types";

const baseUrl = "https://kllx4ijj38.execute-api.us-east-1.amazonaws.com";

type RetrieveNoteResponseData = {
  note: NoteWithContent;
};

type RetrieveNoteResponseError = {
  message: string;
};

type RetrieveNoteResponse = ResponseBody<
  RetrieveNoteResponseData,
  RetrieveNoteResponseError
>;

export async function retrieveNote(
  id: string,
  user: CognitoUser
): Promise<RetrieveNoteResponse> {
  const res = await fetch(`${baseUrl}/notes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user
        .getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()}`
    }
  });

  const resJson = (await res.json()) as RetrieveNoteResponse;

  return resJson;
}

type RetrieveNotesResponseData = {
  notes: Note[];
};

type RetrieveNotesResponseError = {
  message: string;
};

type RetrieveNotesResponse = ResponseBody<
  RetrieveNotesResponseData,
  RetrieveNotesResponseError
>;

export async function retrieveNotes(
  user: CognitoUser
): Promise<RetrieveNotesResponse> {
  const res = await fetch(`${baseUrl}/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user
        .getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()}`
    }
  });

  const resJson = (await res.json()) as RetrieveNotesResponse;

  return resJson;
}

type UpdateNoteResponseError = {
  message: string;
};

type UpdateNoteResponse = ResponseBody<{}, UpdateNoteResponseError>;

type UpdateNoteRequestBody = {
  name?: string;
  description?: string;
  content?: string;
};

export async function updateNote(
  id: string,
  user: CognitoUser,
  updates: UpdateNoteRequestBody
): Promise<UpdateNoteResponse> {
  const res = await fetch(`${baseUrl}/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user
        .getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()}`
    },
    body: JSON.stringify(updates)
  });

  const resJson = (await res.json()) as UpdateNoteResponse;

  return resJson;
}
