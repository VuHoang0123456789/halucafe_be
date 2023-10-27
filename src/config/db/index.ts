const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async () => {
    try {
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });

        await client.connect();
        console.log('connect sucessfuly!');
        return client;
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDb;

export {};
