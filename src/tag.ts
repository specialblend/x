export type Tagged<T extends {}, S extends symbol, V = null> = {
  [k in keyof T]: T[k];
} & { [s in S]: V };

export function Tagged<T, S extends symbol, V>(
  tag: S,
  value: V,
  x: T
): Tagged<T, S, V> {
  return Object.assign(x, { [tag]: value });
}

export function istagged<T, S extends symbol, V>(
  tag: S,
  x: Tagged<T, S, V> | T
): x is Tagged<T, S, V> {
  return tag in x;
}
