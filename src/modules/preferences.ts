import {DB} from './db';

type Preferences = {
  isDarkMode: boolean;
};

type IPreferencesService = {
  getPreferences: () => Preferences;
  setPreferences: (preferences: Preferences) => Promise<void>;
};

export const PreferencesService: IPreferencesService = {
  getPreferences: () => {
    const defaultPreferences: Preferences = {
      isDarkMode: false,
    };

    const preferencesQueryResult = DB.getDatabase().execute(
      'SELECT * FROM Preferences',
    );

    if (
      preferencesQueryResult.rows == null ||
      preferencesQueryResult.rows?.length < 1
    ) {
      return defaultPreferences;
    }

    const preferences = preferencesQueryResult.rows.item(0);
    console.log('preferences read from database: ', preferences);

    return {
      isDarkMode: preferences.isDarkMode,
    };
  },
  setPreferences: async (preferences: Preferences) => {
    await DB.getDatabase().executeAsync(
      `UPDATE Preferences SET isDarkMode = ${preferences.isDarkMode ? 1 : 0}`,
    );
  },
};
