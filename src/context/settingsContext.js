import React from 'react';

const STORAGE_KEY = 'app.settings.v1';

export const DEFAULT_SETTINGS = {
  confirmBeforeCall: true,   // ← PhoneCallLink leerá esto
  openAddressInMaps: true,
  compactProviderCards: false,
  theme: 'system',           // 'system' | 'light' | 'dark'
  language: 'en',            // 'en' | 'es'
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function save(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

const SettingsContext = React.createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  resetSettings: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = React.useState(load);

  React.useEffect(() => {
    save(settings);
  }, [settings]);

  const resetSettings = React.useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = React.useMemo(
    () => ({ settings, setSettings, resetSettings }),
    [settings, resetSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return React.useContext(SettingsContext);
}
