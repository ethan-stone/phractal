import { ResponseBody, Note } from "../../types";

function parseObjectToStrings(obj: {
  [k: string]: string | number | boolean | undefined;
}) {
  const newObj: { [k: string]: string } = {};
  for (const [k, v] of Object.entries(obj)) {
    newObj[k] = new String(v).toString();
  }
  return newObj;
}

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
  note: Note;
};

type RetrieveNoteResponseError = {
  message: string;
};

type RetrieveNoteResponse = ResponseBody<
  RetrieveNoteResponseData,
  RetrieveNoteResponseError
>;

type RetrieveNoteOptions = {
  withTags?: boolean;
  withContent?: boolean;
};

export async function retrieveNote(
  token: string,
  id: string,
  options: RetrieveNoteOptions
): Promise<RetrieveNoteResponse> {
  const queryStringParams = new URLSearchParams(parseObjectToStrings(options));
  const res = await fetch(
    `${baseUrl}/notes/${id}?` + queryStringParams.toString(),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );

  const resJson = (await res.json()) as RetrieveNoteResponse;

  return resJson;
}

type ListNotesResponseData = {
  notes: Note[];
};

type ListNotesResponseError = {
  message: string;
};

type ListNotesResponse = ResponseBody<
  ListNotesResponseData,
  ListNotesResponseError
>;

type ListNotesOptions = {
  skip?: number;
  take?: number;
  withTags?: boolean;
  withContent?: boolean;
};

export async function listNotes(
  token: string,
  options: ListNotesOptions
): Promise<ListNotesResponse> {
  const queryStringParams = new URLSearchParams(parseObjectToStrings(options));
  const res = await fetch(`${baseUrl}/notes?` + queryStringParams.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  const resJson = (await res.json()) as ListNotesResponse;

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

type AddTagResponseError = {
  message: string;
};

type AddTagResponse = ResponseBody<{}, AddTagResponseError>;

export async function addTag(
  token: string,
  id: string,
  name: string
): Promise<AddTagResponse> {
  const res = await fetch(`${baseUrl}/notes/${id}/add-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name
    })
  });

  const resJson = (await res.json()) as AddTagResponse;

  return resJson;
}
