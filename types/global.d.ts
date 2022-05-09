declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
    JWT_SECRET: string;
  }
}
