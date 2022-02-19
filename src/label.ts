import { JsonVal } from "./json";
import { isTagged, Tagged } from "./tag";

const LABELS = Symbol("labels");

export type Labels = {
  [k: string]: JsonVal;
};

export type Labeled<
  T extends {},
  L extends Labels = Labels
  //
> = Tagged<typeof LABELS, L, T>;

export function Labeled<
  T extends {} = {},
  L extends Labels = Labels
  //
>(x: T | Labeled<T, L>, ...labelsv: L[]): Labeled<T, L> {
  return Tagged(
    LABELS,
    Object.assign({}, labels(x), ...labelsv),
    Object.assign({}, x)
    //
  );
}

export function isLabeled<
  T extends {},
  L extends Labels = Labels
  //
>(x: T): x is Labeled<T, L> {
  return isTagged(LABELS, x);
}

export function labels<
  T extends {},
  L extends Labels = Labels
  //
>(x: T | Labeled<T, L>): L {
  return x[LABELS] || {};
}
