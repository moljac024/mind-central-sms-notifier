import type {
  QuickSQLiteConnection,
  Transaction,
} from 'react-native-quick-sqlite';

const MIGRATIONS_TABLE_NAME = 'SchemaMigrationHistory';

async function ensureVersionTable(db: QuickSQLiteConnection) {
  const sql = `
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE_NAME} (
        VersionID INTEGER PRIMARY KEY,
        Name TEXT,
        AppliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.executeAsync(sql);
  return;
}

export async function getDatabaseVersion(
  db: QuickSQLiteConnection,
): Promise<number> {
  try {
    const results = await db.executeAsync(
      `SELECT MAX(VersionID) as maxVersion FROM ${MIGRATIONS_TABLE_NAME}`,
    );

    if (
      results.rows &&
      results.rows.length > 0 &&
      results.rows.item(0).maxVersion != null
    ) {
      return results.rows.item(0).maxVersion;
    }
    return 0; // default version if no migrations have been applied
  } catch (e) {
    return 0;
  }
}

export type MigrationScript = {
  name: string;
  up: (db: Transaction) => Promise<void>;
};

async function getAllAppliedMigrations(
  tx: Transaction,
): Promise<{version: number; name: string}[]> {
  const result = await tx.executeAsync(
    `SELECT VersionID, Name FROM ${MIGRATIONS_TABLE_NAME}`,
  );
  const migrations: {version: number; name: string}[] = [];

  if (result.rows == null) {
    return migrations;
  }

  for (let i = 0; i < result.rows.length; i++) {
    migrations.push({
      version: result.rows.item(i).VersionID,
      name: result.rows.item(i).Name,
    });
  }
  return migrations;
}

export async function applyMigrations(
  db: QuickSQLiteConnection,
  migrations: MigrationScript[],
): Promise<void> {
  await ensureVersionTable(db);

  await db.transaction(async tx => {
    try {
      const appliedMigrations = await getAllAppliedMigrations(tx);

      for (let i = 0; i < migrations.length; i++) {
        const targetVersion = i + 1;
        const migration = migrations[i];

        const existingMigration =
          appliedMigrations.length >= targetVersion
            ? appliedMigrations[targetVersion - 1]
            : null;

        if (existingMigration) {
          if (existingMigration.name !== migration.name) {
            throw new Error(
              `Migration name mismatch for version ${targetVersion}: expected '${migration.name}', found '${existingMigration.name}'.`,
            );
          }

          // Skip this migration as it's already applied
          console.log(`Skipping migration ${migration.name}`);
          continue;
        }

        console.log(`Applying migration ${migration.name}`);
        // Apply the migration
        await migration.up(tx);

        // Insert a new record into the migration history table
        await tx.executeAsync(
          `INSERT INTO ${MIGRATIONS_TABLE_NAME} (VersionID, Name) VALUES (?, ?)`,
          [targetVersion, migrations[i].name],
        );
        console.log(`Applied migration ${migration.name}`);
      }
      tx.commit();
      console.log('All migrations applied.');
    } catch (e) {
      tx.rollback();
      console.log('Error running migrations: ', e);
    }
  });
}

export async function resetDatabaseForDevelopment(
  db: QuickSQLiteConnection,
): Promise<void> {
  if (__DEV__) {
    console.log('Resetting database for development...');

    // Begin transaction for database reset
    await db.transaction(async tx => {
      // Fetch all table names except for 'sqlite_sequence' and MIGRATIONS_TABLE_NAME
      const result = await tx.executeAsync(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence', '${MIGRATIONS_TABLE_NAME}');`,
      );

      if (result.rows == null) {
        throw new Error('Failed to fetch table names.');
      }

      for (let i = 0; i < result.rows.length; i++) {
        const tableName = result.rows.item(i).name;
        await tx.executeAsync(`DROP TABLE IF EXISTS ${tableName}`);
        await tx.executeAsync(`DELETE FROM ${MIGRATIONS_TABLE_NAME}`);
        await tx.executeAsync('DELETE FROM sqlite_sequence');
      }
    });

    console.log('Database reset complete.');
  } else {
    console.error(
      'Attempted to reset database in non-development environment.',
    );
  }
}
