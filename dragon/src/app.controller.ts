import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AppService } from './app.service';
import { SuperTokensGuard } from './auth/guards/supertokens.guard';
import { Session } from './common/decorators/session.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(SuperTokensGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(SuperTokensGuard)
  @Get('test')
  test(@Session() session: SessionContainer): string {
    console.log(session);
    return 'Hi';
  }
}
