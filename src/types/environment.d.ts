export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            PGUSER: string;
            PGHOST: string;
            PGDATABASE: string;
            PGPASSWORD: string;
            PGPORT: number;
            REFRESH_TOKEN_SIZE: number;
            SERERT_KEY_ACCESS_TOKEN: string;
            TOKEN_LIFE: string;
            SALT_ROUNDS: number;
            SENDGRID_API_KEY: string;
            ADMIN_EMAIL_ADDRESS: string;
        }
    }
}
