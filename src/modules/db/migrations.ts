import {MigrationScript} from '../../lib/db';

export const migrations: MigrationScript[] = [
  {
    name: 'Initial',
    up: async tx => {
      // Create the preferences table
      await tx.executeAsync(`
        CREATE TABLE IF NOT EXISTS Preferences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          -- Alternative to using a trigger to ensure only one row can be inserted
          -- id INTEGER PRIMARY KEY AUTOINCREMENT CHECK (id = 0),
          isDarkMode BOOLEAN NOT NULL DEFAULT 0
        );
      `);

      // Create the trigger to ensure only one row can be inserted
      await tx.executeAsync(`
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
      await tx.executeAsync(`
        CREATE TABLE IF NOT EXISTS SmsEvents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phoneNumber TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          success BOOLEAN NOT NULL
        );
      `);
    },
    postApply: async tx => {
      // TODO: Get the prefered theme from the OS
      // Insert the initial preferences row
      console.log('Inserting initial preferences row');
      await tx.executeAsync(`
        INSERT INTO Preferences (isDarkMode) VALUES (0);
      `);

      // These would fail because of the one-row limit:

      //   console.log('Inserting second preferences row');
      //   await tx.executeAsync(`
      //     INSERT INTO Preferences (isDarkMode) VALUES (0);
      // `);
      //   console.log('Inserting third preferences row');
      //   await tx.executeAsync(`
      //     INSERT INTO Preferences (isDarkMode) VALUES (0);
      //   `);
    },
  },
];
