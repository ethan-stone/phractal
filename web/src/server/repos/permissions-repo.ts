import { env } from "@/env.mjs";
import { Permit } from "permitio";
import { type IPermitClient } from "permitio";

type CreateResourceArgs = {
  key: string;
  name: string;
  description?: string;
  actions: {
    [k: string]: {
      description?: string;
      name?: string;
    };
  };
};

type CreateResourceResult = {
  key: string;
  name: string;
  description?: string;
  actions: {
    [k: string]: {
      description?: string;
      name?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserArgs = {
  key: string;
};

type CreateUserResult = {
  key: string;
};

type CreateRoleArgs = {
  key: string;
  name: string;
  permissions: { resource: string; action: string }[];
};

type CreateRoleResult = {
  key: string;
  name: string;
  permissions: { resource: string; action: string }[];
  createdAt: Date;
  updatedAt: Date;
};

export interface IPermssionsRepo {
  check(user: string, action: string, resource: string): Promise<boolean>;
  createResource(args: CreateResourceArgs): Promise<CreateResourceResult>;
  createUser(args: CreateUserArgs): Promise<CreateUserResult>;
  deleteUser(key: string): Promise<void>;
  createRole(args: CreateRoleArgs): Promise<CreateRoleResult>;
}

export class PermissionsRepo {
  constructor(private source: IPermitClient) {}

  async check(
    user: string,
    action: string,
    resource: string
  ): Promise<boolean> {
    return this.source.check(user, action, resource);
  }

  async createResource(
    args: CreateResourceArgs
  ): Promise<CreateResourceResult> {
    const res = await this.source.api.createResource({
      actions: args.actions,
      key: args.key,
      name: args.name,
    });

    return {
      actions: res.actions || {},
      key: res.key,
      name: res.name,
      createdAt: new Date(res.created_at),
      updatedAt: new Date(res.updated_at),
      description: res.description,
    };
  }

  async createUser(args: CreateUserArgs): Promise<CreateUserResult> {
    const res = await this.source.api.createUser({
      key: args.key,
    });

    return {
      key: res.key,
    };
  }

  async deleteUser(key: string): Promise<void> {
    await this.source.api.deleteUser(key);
  }

  async createRole(args: CreateRoleArgs): Promise<CreateRoleResult> {
    const res = await this.source.api.createRole({
      key: args.key,
      name: args.name,
      permissions: args.permissions.map((p) => `${p.resource}:${p.action}`),
    });

    return {
      key: res.key,
      name: res.name,
      permissions:
        res.permissions?.map((p) => {
          const [resource, action] = p.split(":");

          return {
            action: resource as string,
            resource: action as string,
          };
        }) || [],
      createdAt: new Date(res.created_at),
      updatedAt: new Date(res.updated_at),
    };
  }
}

const permit = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: env.PERMIT_IO_API_KEY,
});

export const permissionsRepo = new PermissionsRepo(permit);
