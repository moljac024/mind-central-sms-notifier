import {open} from 'react-native-quick-sqlite';

import * as DB from '../../lib/db';
import {migrate} from './migrations';

const DB_NAME = 'test.db';

export async function getDatabaseVersion() {
  const db = open({name: DB_NAME});
  const databaseVersion = await DB.getDatabaseVersion(db);

  console.log('database version: ', databaseVersion);

  db.close();
}

export async function runMigrations() {
  const db = open({name: DB_NAME});

  await migrate(db);

  db.close();
}

export async function resetDatabaseForDevelopment() {
  const db = open({name: DB_NAME});

  await DB.resetDatabaseForDevelopment(db);

  db.close();
}
