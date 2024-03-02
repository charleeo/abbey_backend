import * as dotenv from 'dotenv';
const fs = require('fs')
import {
  DataSource,
  DataSourceOptions,
} from 'typeorm';

dotenv.config();
const port = process.env.DB_PORT;
const appEnv = process.env.APP_ENV
export const datasourceOption: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: port as number|any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  logging: false,
  migrationsRun: false,
  subscribers: [],
  // ssl: {
  //    rejectUnauthorized: false,
  // },

  // // ssl: {
  //   rejectUnauthorized: true, // You can set this to false if you want to bypass certificate validation
  //   ca: fs.readFileSync('/path/to/rds-combined-ca-bundle.pem').toString(), // Path to the downloaded RDS CA certificate
  // },
};

const datasource = new DataSource(datasourceOption);
export default datasource;
