import { client } from "@/utils/liveblocks";
import { createRoomContext } from "@liveblocks/react";
import { type LiveObject } from "@liveblocks/client";

type Presence = {
  cursor: { position: number } | null;
};

type Storgae = {
  note: LiveObject<{ content: string }>;
};

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { RoomProvider, useOthers, useUpdateMyPresence, useMutation } =
  createRoomContext<Presence, Storgae>(client);
