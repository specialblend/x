export type Tagged<S extends symbol, V, T> = {
  [k in keyof T]: T[k];
} & { [s in S]: V };

export function Tagged<S extends symbol, V, T>(
  sym: S,
  value: V,
  x: T
): Tagged<S, V, T> {
  return Object.assign({}, x, { [sym]: value });
}

export function isTagged<S extends symbol, V, T>(
  tag: S,
  x: Tagged<S, V, T> | T
): x is Tagged<S, V, T> {
  return tag in x;
}
