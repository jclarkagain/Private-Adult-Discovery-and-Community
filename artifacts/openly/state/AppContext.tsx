import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DirectoryResource } from '@/data/directory';

const STORAGE_KEY = '@openly/private-space-v1';

export interface PersonalProfile {
  displayName: string;
  identity: string;
  pronouns: string;
  region: string;
  about: string;
  interests: string[];
}

export interface OpenlyData {
  adultConfirmed: boolean;
  savedIds: string[];
  customResources: DirectoryResource[];
  flaggedIds: string[];
  safetyChecks: Record<string, boolean>;
  profile: PersonalProfile;
}

const INITIAL_DATA: OpenlyData = {
  adultConfirmed: false,
  savedIds: [],
  customResources: [],
  flaggedIds: [],
  safetyChecks: {},
  profile: {
    displayName: '',
    identity: '',
    pronouns: '',
    region: '',
    about: '',
    interests: [],
  },
};

export const INTEREST_SUGGESTIONS = [
  'Personal interest',
  'BDSM & power exchange',
  'Leather',
  'Role play',
  'Sensory play',
  'Voyeurism',
  'Exhibitionism',
  'Water sports',
  'Toys',
  'Something else',
];

interface AppContextValue {
  data: OpenlyData;
  isLoading: boolean;
  loadError: boolean;
  saveError: boolean;
  confirmAdult: () => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  toggleSaved: (id: string) => Promise<boolean>;
  addResource: (resource: DirectoryResource) => Promise<boolean>;
  removeResource: (id: string) => Promise<boolean>;
  toggleFlagged: (id: string) => Promise<boolean>;
  updateProfile: (patch: Partial<PersonalProfile>) => Promise<boolean>;
  toggleInterest: (interest: string) => Promise<boolean>;
  toggleSafetyCheck: (id: string) => Promise<boolean>;
  retryStorage: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function normalizeStoredData(value: unknown): OpenlyData {
  if (!value || typeof value !== 'object') {
    throw new Error('Saved data is not valid.');
  }

  const candidate = value as Partial<OpenlyData>;
  const savedProfile: Partial<PersonalProfile> =
    candidate.profile && typeof candidate.profile === 'object'
      ? candidate.profile
      : {};

  return {
    adultConfirmed: candidate.adultConfirmed === true,
    savedIds: Array.isArray(candidate.savedIds)
      ? candidate.savedIds.filter((item): item is string => typeof item === 'string')
      : [],
    customResources: Array.isArray(candidate.customResources)
      ? (candidate.customResources as DirectoryResource[])
      : [],
    flaggedIds: Array.isArray(candidate.flaggedIds)
      ? candidate.flaggedIds.filter((item): item is string => typeof item === 'string')
      : [],
    safetyChecks:
      candidate.safetyChecks && typeof candidate.safetyChecks === 'object'
        ? candidate.safetyChecks
        : {},
    profile: {
      ...INITIAL_DATA.profile,
      ...savedProfile,
      interests: Array.isArray(savedProfile.interests)
        ? savedProfile.interests.filter(
            (item): item is string => typeof item === 'string',
          )
        : [],
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OpenlyData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const dataRef = useRef(data);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const retryStorage = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const next = stored ? normalizeStoredData(JSON.parse(stored)) : INITIAL_DATA;
      dataRef.current = next;
      setData(next);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void retryStorage();
  }, [retryStorage]);

  const commit = useCallback(
    async (change: (current: OpenlyData) => OpenlyData) => {
      let saved = false;
      const operation = writeQueue.current
        .then(async () => {
          const next = change(dataRef.current);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          dataRef.current = next;
          setData(next);
          setSaveError(false);
          saved = true;
        })
        .catch(() => {
          setSaveError(true);
        });
      writeQueue.current = operation;
      await operation;
      return saved;
    },
    [],
  );

  const confirmAdult = useCallback(
    () => commit(current => ({ ...current, adultConfirmed: true })),
    [commit],
  );

  const clearAllData = useCallback(
    () => commit(() => INITIAL_DATA),
    [commit],
  );

  const toggleSaved = useCallback(
    (id: string) =>
      commit(current => ({
        ...current,
        savedIds: current.savedIds.includes(id)
          ? current.savedIds.filter(savedId => savedId !== id)
          : [...current.savedIds, id],
      })),
    [commit],
  );

  const addResource = useCallback(
    (resource: DirectoryResource) =>
      commit(current => ({
        ...current,
        customResources: [resource, ...current.customResources],
      })),
    [commit],
  );

  const removeResource = useCallback(
    (id: string) =>
      commit(current => ({
        ...current,
        customResources: current.customResources.filter(item => item.id !== id),
        savedIds: current.savedIds.filter(savedId => savedId !== id),
        flaggedIds: current.flaggedIds.filter(flaggedId => flaggedId !== id),
      })),
    [commit],
  );

  const toggleFlagged = useCallback(
    (id: string) =>
      commit(current => ({
        ...current,
        flaggedIds: current.flaggedIds.includes(id)
          ? current.flaggedIds.filter(flaggedId => flaggedId !== id)
          : [...current.flaggedIds, id],
      })),
    [commit],
  );

  const updateProfile = useCallback(
    (patch: Partial<PersonalProfile>) =>
      commit(current => ({
        ...current,
        profile: { ...current.profile, ...patch },
      })),
    [commit],
  );

  const toggleInterest = useCallback(
    (interest: string) =>
      commit(current => ({
        ...current,
        profile: {
          ...current.profile,
          interests: current.profile.interests.includes(interest)
            ? current.profile.interests.filter(item => item !== interest)
            : [...current.profile.interests, interest],
        },
      })),
    [commit],
  );

  const toggleSafetyCheck = useCallback(
    (id: string) =>
      commit(current => ({
        ...current,
        safetyChecks: {
          ...current.safetyChecks,
          [id]: !current.safetyChecks[id],
        },
      })),
    [commit],
  );

  const value = useMemo(
    () => ({
      data,
      isLoading,
      loadError,
      saveError,
      confirmAdult,
      clearAllData,
      toggleSaved,
      addResource,
      removeResource,
      toggleFlagged,
      updateProfile,
      toggleInterest,
      toggleSafetyCheck,
      retryStorage,
    }),
    [
      data,
      isLoading,
      loadError,
      saveError,
      confirmAdult,
      clearAllData,
      toggleSaved,
      addResource,
      removeResource,
      toggleFlagged,
      updateProfile,
      toggleInterest,
      toggleSafetyCheck,
      retryStorage,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useOpenly() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useOpenly must be used inside AppProvider.');
  }
  return context;
}

