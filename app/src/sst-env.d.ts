/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly STAGE: string | undefined;
  readonly API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
