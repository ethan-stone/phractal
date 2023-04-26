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

export interface IPermssionsRepo {
  check(user: string, action: string, resource: string): Promise<boolean>;
  createResource(args: CreateResourceArgs): Promise<CreateResourceResult>;
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
}

const permit = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: env.PERMIT_IO_API_KEY,
});

export const permissionsRepo = new PermissionsRepo(permit);
