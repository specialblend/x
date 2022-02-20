import type { BinaryLike } from "crypto";

import { createHash } from "crypto";

export type Factory<T> = (key?: string | symbol) => T;
export type Generator<T, R> = { [key in keyof R]: T };

export function hashtag(...data: (string | BinaryLike)[]): string {
  const hashtag = createHash("sha256");
  data.map((d) => hashtag.update(d));
  return hashtag.digest("hex").substring(0, 7);
}

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
      return `${namespace}:${key}#${hashtag(key)}`;
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
      return Math.round(seed % 123);
    }
    //
  );
}

export function MockGenerator<R>() {
  return Generator<jest.Mock, R>(() => jest.fn());
}
