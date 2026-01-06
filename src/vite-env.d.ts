/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_PLAID_CLIENT_ID: string
  readonly VITE_PLAID_ENV: string
  readonly VITE_FINNHUB_API_KEY: string
  readonly VITE_WEB3FORMS_KEY: string
  readonly OPENAI_API_KEY: string
  readonly ANTHROPIC_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
