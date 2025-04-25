/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Cambia REACT_APP_API_URL a VITE_API_URL
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
