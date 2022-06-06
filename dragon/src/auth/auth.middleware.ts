import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.supertokensMiddleware(req, res, next);
  }
}
