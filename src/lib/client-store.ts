/**
 * 클라이언트 전용 미니 스토어.
 * localStorage / sessionStorage 처럼 React 밖에 있는 값을 `useSyncExternalStore` 로
 * 안전하게 읽기 위해 사용합니다. (하이드레이션 불일치와 effect 내 setState 를 피합니다)
 */

const emptySubscribe = () => () => {};

/** 하이드레이션 완료 여부 — 서버 렌더 시에는 false */
export const hydratedStore = {
  subscribe: emptySubscribe,
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};

export function createStorageStore<T>(
  storage: "local" | "session",
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = serverValue;

  const area = () => (storage === "local" ? window.localStorage : window.sessionStorage);

  function read(): string | null {
    try {
      return area().getItem(key);
    } catch {
      return null;
    }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot(): T {
      const raw = read();
      if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedValue = parse(raw);
      }
      return cachedValue;
    },
    getServerSnapshot(): T {
      return serverValue;
    },
    write(value: T, serialize: (value: T) => string) {
      try {
        area().setItem(key, serialize(value));
      } catch {
        // 저장 공간을 못 쓰는 환경에서도 화면 상태는 유지되어야 합니다.
      }
      cachedRaw = read();
      cachedValue = value;
      listeners.forEach((listener) => listener());
    },
  };
}
