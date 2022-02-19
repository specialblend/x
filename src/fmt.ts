import { labels } from "./label.ts";
import { Err } from "./err.ts";

export function trimr<T extends Record<any, any>>(rec: T): Partial<T> {
  return Object.assign(
    {},
    ...Object.entries(rec)
      .filter(
        ([key, value]) => {
          return typeof key === "string" &&
            (
              typeof value === "number" ||
              typeof value === "bigint" ||
              value
            );
        },
      )
      .map(([key, value]) => ({ [key]: value })),
  );
}

export function trimss(x: string[]): string[] {
  return x.map((x) => x.trim()).filter((x) => x);
}

export function fmterr(err: Error | Err) {
  if ("code" in err) {
    const { message, code } = err;
    return [message, { code }, labels(err)];
  }
  const { message } = err;
  return [message];
}
