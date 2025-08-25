import 'dotenv/config';
import { DataSource } from "typeorm";
import { UserDatabase, CategoryDatabase, EventDatabase, CheckinDatabase } from '../database/entity/index.js';

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [UserDatabase, CategoryDatabase, EventDatabase, CheckinDatabase],
  synchronize: true,
  ssl: true
});

AppDataSource.initialize()
  .then(() => {
    
  })
  .catch((error) => console.error(`[${new Date().toISOString()}] [msg:"Data Source initialization failed"] [error: ${error.message}]`));

export { AppDataSource };
