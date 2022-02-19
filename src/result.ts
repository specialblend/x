import { labeled, Labels } from "./label.ts";

import { Err, isErr } from "./err.ts";

export type Ok<T> = {
  status: "fulfilled";
  value: T;
};

export type Fail<T> = {
  status: "rejected";
  value: T;
  reason: Err;
};

export type Result<I, O> = Fail<I> | Ok<O>;

export function Ok<T>(value: T): Ok<T> {
  return {
    status: "fulfilled",
    value,
  };
}

export function Fail<T>(
  value: T,
  reason: Error | Err,
  ...debug: Labels[]
): Fail<T> {
  return {
    status: "rejected",
    reason: Err(reason, ...debug),
    value,
  };
}

export function Safe<I, O>(fn: (i: I) => O) {
  return function wrapped(x: I): Result<I, O> {
    try {
      return Ok(fn(x));
    } catch (err) {
      return Fail(x, err);
    }
  };
}

export function SafeAsync<I, O>(fn: (i: I) => Promise<O>) {
  return async function wrapped(x: I): Promise<Result<I, O>> {
    try {
      return Ok(await fn(x));
    } catch (err) {
      return Fail(x, err);
    }
  };
}
