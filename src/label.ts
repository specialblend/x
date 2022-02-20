import type { JsonVal } from "./json";

import { isTagged, Tagged } from "./tag";

const LABELS = Symbol("labels");

export type Labels = {
  [k: string]: JsonVal;
};

export type Labeled<T> = Tagged<typeof LABELS, Labels, T>;

export function Labeled<T>(
  x: T | Labeled<T>,
  ...labelsv: Labels[]
): Labeled<T> {
  return Tagged(
    LABELS,
    Object.assign({}, labels(x), ...labelsv),
    Object.assign({}, x)
  );
}

export function isLabeled<T>(x: T): x is Labeled<T> {
  return isTagged(LABELS, x);
}

export function labels<T>(x: T | Labeled<T>): Labels {
  return x[LABELS] || {};
}
