import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False while prerendering and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
