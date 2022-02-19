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

export function StrGenr<R>(namespace: string = "mock") {
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

export function IntGenr<R>(salt = 1234) {
  return Generator<number, R>(
    (k) =>
      // @ts-ignore
      [...String(k)]
        //
        .map((c) => c.charCodeAt(0))
        .reduce((p, c) => p + c) %
      (salt % 13)
  );
}

export function MockGenr<R>() {
  return Generator<jest.Mock, R>(
    () => jest.fn()
    //
  );
}
