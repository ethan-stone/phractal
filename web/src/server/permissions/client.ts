import { Permit } from "permitio";

export const client = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: "",
});

async function main() {
  const res1 = await client.api.updateResource("note_123", {
    actions: {
      read: {},
      write: {},
      delete: {},
    },
  });

  console.log(res1);

  const res2 = await client.api.createRole({
    key: "owner_123",
    name: "Owner of 123",
    permissions: ["note_123:read", "note_123:write", "note_123:delete"],
  });

  console.log(res2);
}

void main();
