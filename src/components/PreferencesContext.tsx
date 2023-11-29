import * as React from 'react';

export type PreferencesContextType = {
  toggleTheme: () => void;
  isThemeDark: boolean;
};

export const PreferencesContext = React.createContext<PreferencesContextType>({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const usePreferences = () => React.useContext(PreferencesContext);
