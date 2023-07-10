import { useMemo } from "react";

export function useIndex<T, K extends keyof T>(items: T[] | null | undefined, key: K) {
  const index = useMemo(() => {
    if(items) {
      const index: {[key: string]: T} = {};
      for(const item of items) {
        index[item[key] as string] = item;
      }

      return index;
    }

    return null;
  }, [items, key]);

  return index;
}