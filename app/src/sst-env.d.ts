/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly STAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}