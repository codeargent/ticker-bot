import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { PriceAlert } from './entities/price-alert';
import { ApiLog } from './entities/api-log';

dotenv.config();

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [PriceAlert, ApiLog],
    synchronize: true,
    logging: false,
});

// Initialize the data source (connect to the database)
appDataSource.initialize().then(() => {
    console.log('Data Source has been initialized!');
}).catch((error) => {
    console.error('Error during Data Source initialization', error);
    process.exit(1);
});
