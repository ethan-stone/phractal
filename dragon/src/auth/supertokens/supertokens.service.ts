import { Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, CONFIG_INJECTION_TOKEN } from '../types';
import supertokens from 'supertokens-node';
import ThirdPartEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(CONFIG_INJECTION_TOKEN) authModuleConfig: AuthModuleConfig,
    prismaService: PrismaService,
  ) {
    supertokens.init({
      appInfo: authModuleConfig.appInfo,
      supertokens: {
        connectionURI: authModuleConfig.connectionURI,
        apiKey: authModuleConfig.apiKey,
      },
      recipeList: [
        ThirdPartEmailPassword.init({
          providers: [],
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                emailPasswordSignUpPOST: async (input) => {
                  const response =
                    await originalImplementation.emailPasswordSignUpPOST(input);

                  if (response.status === 'OK') {
                    await prismaService.user.create({
                      data: {
                        id: response.user.id,
                        email: response.user.email,
                      },
                    });
                  }

                  return response;
                },
              };
            },
          },
        }),
        Session.init(),
      ],
    });
  }
}
