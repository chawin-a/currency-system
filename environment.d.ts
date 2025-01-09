declare global {
    namespace NodeJS {
        interface ProcessEnv {
            POSTGRES_HOST: string;
            POSTGRES_PORT: string;
            POSTGRES_USERNAME: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_DATABASE: string;
        }
    }
}

export {}