import { Labels } from "./label";

export type Trimmer = (x: [string, any]) => boolean;
export type Linter<T> = (x: Partial<T>) => T|never;

export function fmtl<T extends Record<any, any>>(x: T): Labels {
  return trim(
    x,
    ([key, value]) => rejectComplex([key, value]) && rejectEmpty([key, value])
  );
}

export function trim<T = any>(x: Array<T>): T[];
export function trim<T>(x: T): T | string;
export function trim<T extends Record<any, any>, K extends keyof T>(
  rec: T,
  trimmer?: Trimmer
): Partial<T>;

export function trim(x, trimmer?) {
  if (typeof x === "object") {
    if (Array.isArray(x)) {
      return trimv(x);
    }
    return trimr(x, trimmer);
  }
  return trims(x);
}

export function trimr<T extends Record<any, any>, K extends keyof T>(
  rec: T,
  trimmer: Trimmer = rejectEmpty
): Partial<T> {
  return Object.assign(
    {},
    ...Object.entries(rec)
      .filter(trimmer)
      .map(([key, value]) => ({ [key]: value }))
  );
}

export function trims<T>(x: T): T | string {
  if (typeof x === "string") {
    return x.trim();
  }
  return x;
}

export function trimv<T = any>(x: Array<T>): T[] {
  return x.filter((x) => rejectEmpty(["", x]));
}

export function rejectEmpty([key, value]: [string, any]) {
  return (
    typeof key === "string" &&
    (typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "bigint" ||
      trims(value))
  );
}

export function rejectComplex([key, value]: [string, any]) {
  return typeof value !== "object";
}
