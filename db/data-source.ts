import * as dotenv from 'dotenv';
const fs = require('fs')
import {
  DataSource,
  DataSourceOptions,
} from 'typeorm';

dotenv.config();
const port = process.env.DB_PORT;
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

};

const datasource = new DataSource(datasourceOption);
export default datasource;
