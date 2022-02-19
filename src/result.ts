import { Err, pitch } from "./err";
import { labels, Labels } from "./label";

export interface Result<I, O> {
  status: "fulfilled" | "rejected";
  value: I | O;
  reason?: Err;
  getOr(x: O): O;
  unwrap(): O | never;
}

export interface Ok<O, I = unknown> extends Result<I, O> {
  status: "fulfilled";
  value: O;
}

export function Ok<O, I = unknown>(value: O): Ok<O, I> {
  return {
    status: "fulfilled",
    value,
    getOr(x: O): O {
      return value;
    },
    unwrap(): O {
      return value;
    },
  };
}

export function isOk<I, O>(x: Result<I, O>): x is Ok<O, I> {
  return x.status === "fulfilled";
}

export function isFail<I, O>(x: Result<I, O>): x is Fail<I, O> {
  return x.status === "rejected";
}

export interface Fail<I, O = unknown> extends Result<I, O> {
  status: "rejected";
  value: I;
  reason: Err;
}

export function Fail<I, O = unknown>(
  value: I,
  reason: Error | Err,
  ...debug: Labels[]
): Fail<I, O> {
  const err = Err(reason.message, ...debug);
  return {
    status: "rejected",
    reason: err,
    value,
    getOr(x: O): O {
      return x;
    },
    unwrap(): O | never {
      return pitch(err.message, labels(err), ...debug);
    },
  };
}

export type P = PromiseConstructor;
export type Fn<I, O> = (x: I) => O;

export function Safely<I, O>(fn: Fn<I, O>): (x: I) => Result<I, O>;

export function Safely<I, O>(
  fn: Fn<I, O | Promise<O>>,
  mode: P
): (x: I) => Promise<Result<I, O>>;

export function Safely<I, O>(fn: Fn<I, O>, mode?: P) {
  if (mode === Promise) {
    return async function wrapped(x: I): Promise<Result<I, O>> {
      try {
        return Ok(await fn(x));
      } catch (err) {
        return Fail(x, err);
      }
    };
  }
  return function wrapped(x: I): Result<I, O> {
    try {
      return Ok(fn(x));
    } catch (err) {
      return Fail(x, err);
    }
  };
}
