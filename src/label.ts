import { JsonVal } from "./json";
import { istagged, Tagged } from "./tag";

const LABELS = Symbol("labels");

export type Labels = {
  [k: string]: JsonVal;
};

export type Labeled<T extends {}> = Tagged<T, typeof LABELS, Labels>;

export function Labeled<T extends {}>(
  x: T | Labeled<T>,
  ...labelsv: Labels[]
): Labeled<T> {
  return Tagged(LABELS, Object.assign({}, labels(x), ...labelsv), x);
}

export function islabeled<T extends {}>(x: T): x is Labeled<T> {
  return istagged(LABELS, x);
}

export function labels<T extends {}>(x: T | Labeled<T>): Labels {
  if (islabeled(x)) {
    return x[LABELS] || {};
  }
  return {};
}
