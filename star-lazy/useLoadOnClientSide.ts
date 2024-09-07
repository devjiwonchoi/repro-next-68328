import { useEffect, useState } from 'react';

// we use empty object and not undefined because of object comparison by reference
const empty = {};
/**
 * Lazy load the given dependency to delay code download, parsing and execution
 *
 *  @example const slick = useLoadOnClientSide(() => import(/* webpackChunkName: "slick" * / "slick"), null);
 */
export const useLoadOnClientSide = <TModule, TFallback>(
  loader: () => Promise<TModule>,
  fallback: TFallback,
  options?: { skip?: boolean }
) => {
  const [lazyModule, setLazyModule] = useState<TModule | typeof empty>(
    () => getFromCache(loader) || empty
  );
  const skip = lazyModule !== empty || (options && options.skip);
  useEffect(() => {
    if (skip || typeof document === 'undefined') {
      return;
    }
    let mounted = true;
    loaderEnvironment.run(loader).then((mod) => {
      writeToCache(loader, mod);
      // Verify that the component was not unmounted
      // while the lazy componented was downloaded
      if (!mounted) {
        return;
      }
      // 💊 To wait for the following state change in JEST use waitForDynamicImports
      setLazyModule(() => mod);
    });
    return () => {
      mounted = false;
    };
  }, [skip]);
  return lazyModule === empty ? fallback : (lazyModule as TModule);
};

/**
 * The loader environment allows hooking into the dynamic imports
 * during unit testing
 */
export const loaderEnvironment = {
  run: <TModule>(loader: () => Promise<TModule>): Promise<TModule> => {
    return loader();
  },
  cache: new WeakMap<() => unknown, unknown>(),
};

const getFromCache = <TModule>(
  loader: () => Promise<TModule>
): TModule | undefined => {
  return loaderEnvironment.cache.get(loader) as TModule | undefined;
};

const writeToCache = <TModule>(
  loader: () => Promise<TModule>,
  value: TModule
) => {
  loaderEnvironment.cache.set(loader, value);
};
