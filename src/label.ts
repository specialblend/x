import { JsonVal } from "./json.ts";
import { isTagged, Tagged } from "./tag.ts";

const LABELS = Symbol("labels");

export type Labels = {
  [k: string]: JsonVal;
};

export type Labeled<T extends {}> = Tagged<T, typeof LABELS, Labels>;

export function labeled<T extends {}>(
  x: T | Labeled<T>,
  ...labelsv: Labels[]
): Labeled<T> {
  return Tagged(LABELS, Object.assign({}, labels(x), ...labelsv), x);
}

export function isLabeled<T extends {}>(x: T): x is Labeled<T> {
  return isTagged(LABELS, x);
}

export function labels<T extends {}>(x: T | Labeled<T>): Labels {
  if (isLabeled(x)) {
    return x[LABELS] || {};
  }
  return {};
}
