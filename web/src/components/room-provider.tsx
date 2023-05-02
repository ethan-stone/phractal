import { client } from "@/utils/liveblocks";
import { createRoomContext } from "@liveblocks/react";
import { type LiveObject } from "@liveblocks/client";

type Presence = {
  cursor: { position: number } | null;
};

type Storgae = {
  note: LiveObject<{ content: string; name: string }>;
};

/* eslint-disable @typescript-eslint/unbound-method */
export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useMutation,
  useStorage,
  useRoom,
} = createRoomContext<Presence, Storgae>(client);
/* eslint-enable @typescript-eslint/unbound-method */
