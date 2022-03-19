import { ResponseBody, Note, NoteWithContent } from "../../types";

const baseUrl = "https://kllx4ijj38.execute-api.us-east-1.amazonaws.com";

type CreateNoteResponseData = {
  id: string;
};

type CreateNoteResponseError = {
  message: string;
};

type CreateNoteResponse = ResponseBody<
  CreateNoteResponseData,
  CreateNoteResponseError
>;

export async function createNote(
  token: string,
  name: string,
  description: string,
  visibility: "PUBLIC" | "PRIVATE"
): Promise<CreateNoteResponse> {
  const res = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name,
      description,
      visibility
    })
  });

  const resJson = (await res.json()) as CreateNoteResponse;

  return resJson;
}

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
  token: string,
  id: string
): Promise<RetrieveNoteResponse> {
  const res = await fetch(`${baseUrl}/notes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
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
  token: string
): Promise<RetrieveNotesResponse> {
  const res = await fetch(`${baseUrl}/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
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
  token: string,
  id: string,
  updates: UpdateNoteRequestBody
): Promise<UpdateNoteResponse> {
  const res = await fetch(`${baseUrl}/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  const resJson = (await res.json()) as UpdateNoteResponse;

  return resJson;
}
