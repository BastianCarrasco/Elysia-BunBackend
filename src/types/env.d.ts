declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT: string;
    ENVIRONMENT: 'development' | 'production';
  }
}