import { Permit } from "permitio";

export const client = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: "",
});

async function main() {
  const res1 = await client.api.createResource({
    key: "note_456",
    name: "Note 456",
    actions: {
      read: {},
      write: {},
      delete: {},
    },
  });
  // console.log(res1);
  // const res2 = await client.api.createRole({
  //   key: "owner_456",
  //   name: "Owner of 123",
  //   permissions: ["note_456:read", "note_456:write", "note_456:delete"],
  // });
  // console.log(res2);
  // const user = await client.api.createUser({
  //   key: "user_1",
  // });
  // console.log(user);
  const assign = await client.api.assignRole({
    role: "editor_123",
    user: "user_1",
    tenant: "default",
  });
  console.log(assign);
  const start = new Date().getTime();
  const check = await client.check("user_1", "read", "note_123");
  const end = new Date().getTime();

  console.log(check);
  console.log(end - start);
}

void main();
