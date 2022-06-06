import { Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, CONFIG_INJECTION_TOKEN } from '../types';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';

// TODO: add thirdpartyemail password recipes from supertokens

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(CONFIG_INJECTION_TOKEN) authModuleConfig: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: authModuleConfig.appInfo,
      supertokens: {
        connectionURI: authModuleConfig.connectionURI,
        apiKey: authModuleConfig.apiKey,
      },
      recipeList: [Session.init()],
    });
  }
}
