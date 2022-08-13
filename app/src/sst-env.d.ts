/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STAGE: string | undefined;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
