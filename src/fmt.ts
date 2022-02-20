import type { Labels } from "./label";

export type Trimmer = (x: [any, any]) => boolean;
export type Linter<T> = (...debug: Labels[]) => (x: Partial<T>) => T | never;

export function fmtl<T extends Record<any, any>>(x: T): Labels {
  return trimr(
    x,
    ([key, value]) => rejectComplex([key, value]) && rejectEmpty([key, value])
  );
}

export function trimr<T extends Record<any, any>>(
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

export function rejectEmpty([_, value]: [any, any]) {
  return (
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    Boolean(trims(value))
  );
}

export function rejectComplex([key, value]: [string, any]) {
  return typeof key === "string" && typeof value !== "object";
}

export function mask(x: never) {
  return `secret { length: ${String(x).length} }`;
}
