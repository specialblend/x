import type { Labels } from "./label";

import { Labeled, labels } from "./label";
import { Err } from "./err";
import { pitch } from "./err";

export interface Result<I, O> {
  status: "fulfilled" | "rejected";
  value: I | O;
  reason?: Err;
  or(x: O): O;
  unwrap(): O | never;
  expect(msg: string): O | never;
}

export interface Ok<O, I = unknown> extends Result<I, O> {
  status: "fulfilled";
  value: O;
}

export function Ok<O, I = unknown>(value: O): Ok<O, I> {
  return {
    status: "fulfilled",
    value,
    or(x: O): O {
      return value;
    },
    unwrap(): O {
      return value;
    },
    expect(_): O {
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
  const err = Err(reason, ...debug);
  return {
    status: "rejected",
    reason: err,
    value,
    or(x: O): O {
      return x;
    },
    unwrap(): O | never {
      return pitch(err.message, labels(err), ...debug);
    },
    expect(msg: string, ...debug: Labels[]): O | never {
      return pitch(msg, ...debug);
    },
  };
}

export type P = PromiseConstructor;
export type Wrapped<I, O> = (x: I) => Result<I, O>;
export type WrappedP<I, O> = (x: I) => Promise<Result<I, O>>;
export type Fn<I, O> = (x: I, ...args: any[]) => O;
export type FnP<I, O> = (x: I, ...args: any[]) => Promise<O>;

export function Safely<I, O>(fn: Fn<I, O>): Wrapped<I, O>;
export function Safely<I, O>(fn: FnP<I, O>, mode: P): WrappedP<I, O>;

export function Safely<I, O>(fn: Fn<I, O> | FnP<I, O>, mode?: P) {
  if (mode === Promise) {
    return async function wrapped(x: I, ...args): Promise<Result<I, O>> {
      try {
        const res = await (fn as FnP<I, O>)(x, ...args);
        return Ok(res);
      } catch (err) {
        return Fail(x, err);
      }
    };
  }
  return function wrapped(x: I, ...args): Result<I, O> {
    try {
      const res = (fn as Fn<I, O>)(x, ...args);
      return Ok(res);
    } catch (err) {
      return Fail(x, err);
    }
  };
}
