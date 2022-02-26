import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { Note } from "../../types";

type Props = {
  id: string;
  name: string;
  description: string | null;
};

const NoteItem: React.FC<Props> = ({ id, name, description }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function retrieveNote() {
    setLoading(true);

    const res = await fetch(
      `https://kllx4ijj38.execute-api.us-east-1.amazonaws.com/notes/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user
            ?.getSignInUserSession()
            ?.getIdToken()
            .getJwtToken()}`
        }
      }
    );

    const jsonRes = (await res.json()) as {
      data: { note: Note & { content: string } };
    };

    const note = jsonRes.data.note;

    setLoading(false);

    navigate(`/notes/${note.id}`, {
      state: {
        note
      }
    });
  }

  return (
    <button
      type="button"
      onClick={retrieveNote}
      className="flex flex-col justify-start bg-gray-800 py-2 px-4 text-white rounded-lg cursor-pointer"
    >
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <p>{name}</p>
          {description && <p>{description}</p>}
        </>
      )}
    </button>
  );
};

export default NoteItem;
