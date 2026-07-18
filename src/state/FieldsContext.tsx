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
import { Coordinates, Field } from '../types/field';
import { fetchFieldsAtRadius, fetchFieldsWithFallback } from '../lib/overpass/overpassClient';

type FetchStatus = 'loading' | 'loaded' | 'error';

interface FieldsContextValue {
  fields: Field[];
  status: FetchStatus;
  fetchedRadiusMi: number;
  errorMessage?: string;
  /** Re-fetches only if radiusMi exceeds what's already been fetched this session. */
  ensureRadius: (radiusMi: number) => Promise<void>;
}

const FieldsContext = createContext<FieldsContextValue | null>(null);

interface FieldsProviderProps {
  /** The user's location at the time the session's fetch began (fixed, per PRD's "fetch once per session"). */
  origin: Coordinates;
  children: ReactNode;
}

export function FieldsProvider({ origin, children }: FieldsProviderProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [fetchedRadiusMi, setFetchedRadiusMi] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  const originRef = useRef(origin);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchFieldsWithFallback(originRef.current)
      .then((result) => {
        if (cancelled) return;
        setFields(result.fields);
        setFetchedRadiusMi(result.fetchedRadiusMi);
        setStatus('loaded');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load fields');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // Intentionally runs once per mount (per session) — origin is captured via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureRadius = useCallback(
    async (radiusMi: number) => {
      if (radiusMi <= fetchedRadiusMi) return;
      setStatus('loading');
      try {
        const newFields = await fetchFieldsAtRadius(originRef.current, radiusMi);
        setFields(newFields);
        setFetchedRadiusMi(radiusMi);
        setStatus('loaded');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load fields');
        setStatus('error');
      }
    },
    [fetchedRadiusMi]
  );

  const value = useMemo(
    () => ({ fields, status, fetchedRadiusMi, errorMessage, ensureRadius }),
    [fields, status, fetchedRadiusMi, errorMessage, ensureRadius]
  );

  return <FieldsContext.Provider value={value}>{children}</FieldsContext.Provider>;
}

export function useFields(): FieldsContextValue {
  const ctx = useContext(FieldsContext);
  if (!ctx) {
    throw new Error('useFields must be used within a FieldsProvider');
  }
  return ctx;
}
