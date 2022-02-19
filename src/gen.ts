export type Generator<T, R> = { [key in keyof R]: T };

export type FactoryWorker<T> = (key?: string | symbol) => T;
export type Factory<T, A extends Array<any>> = (
  ...args: A
) => FactoryWorker<T>;

export function Generator<T, R, A extends Array<any>>(
  factory: Factory<T, A>,
  ...args: A
): Generator<T, R> {
  const gen = factory(...args);
  return new Proxy({}, {
    get(_, key) {
      return gen(key);
    },
  }) as Generator<T, R>;
}
