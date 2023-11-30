import type {QuickSQLiteConnection} from 'react-native-quick-sqlite';

import {MigrationScript, applyMigrations} from '../../lib/db';

export const migrations: MigrationScript[] = [
  {
    name: 'Initial',
    up: async tx => {
      // Create the preferences table, along with a trigger to ensure only one
      // row can be inserted
      tx.executeAsync(`
        CREATE TABLE IF NOT EXISTS Preferences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          isDarkMode BOOLEAN NOT NULL DEFAULT 0
        );

        CREATE TRIGGER IF NOT EXISTS trg_limit_preferences
        BEFORE INSERT ON Preferences
        BEGIN
            SELECT CASE
                WHEN (SELECT COUNT(*) FROM Preferences) >= 1 THEN
                    RAISE (ABORT, 'Cannot insert more than one row into Preferences table.')
            END;
        END;
      `);

      // Create the SmsEvents table
      tx.executeAsync(`
      CREATE TABLE IF NOT EXISTS SmsEvents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phoneNumber TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN NOT NULL
      );
    `);
    },
  },
];

export async function migrate(db: QuickSQLiteConnection) {
  return applyMigrations(db, migrations);
}
