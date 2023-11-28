import * as React from 'react';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const usePreferences = () => React.useContext(PreferencesContext);
