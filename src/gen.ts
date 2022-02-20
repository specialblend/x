import { createHash } from "crypto";

export type Factory<T> = (key?: string | symbol) => T;
export type Generator<T, R> = { [key in keyof R]: T };

export function Generator<T, R>(factory: Factory<T>): Generator<T, R> {
  return new Proxy(
    {},
    {
      get(_, key) {
        return factory(key);
      },
    }
  ) as Generator<T, R>;
}

export function StrGenerator<R>(namespace = "mock") {
  return Generator<string, R>(
    (k) => {
      const key = String(k);
      const tag = createHash("sha256")
        .update(key)
        .update(namespace)
        .digest("hex")
        .substring(0, 7);
      return `${namespace}:${String(key)}#${tag}`;
    }
    //
  );
}

export function IntGenerator<R>(seed = 0) {
  return Generator<number, R>(
    (key: string) => {
      for (const char of key) {
        seed += char.charCodeAt(0);
      }
      return Math.round(seed % 13);
    }
    //
  );
}

export function MockGenerator<R>() {
  return Generator<jest.Mock, R>(
    () => jest.fn()
    //
  );
}
