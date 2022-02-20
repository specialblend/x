import type { Labels } from "./label";

import { pitch } from "./err";

export interface Option<T> {
  value?: T;
  or(x: T): T;
  unwrap(): T | never;
  expect(msg: string, ...debug: Labels[]): T | never;
  map<R>(fn: (i: T) => R): Option<R>;
}

export interface Some<T> {
  value: T;
  or(x: T): T;
  unwrap(): T | never;
  expect(msg: string, ...debug: Labels[]): T;
  map<R>(fn: (i: T) => R): Some<R>;
}

export interface None<T> extends Option<T> {
  or(x: T): T;
  unwrap(): never;
  expect(msg: string, ...debug: Labels[]): never;
  map<R>(fn: (i: T) => R): None<R>;
}

export function Some<T>(value: T): Some<T> {
  return {
    value,
    or(o: T): T {
      return value;
    },
    unwrap(): T {
      return value;
    },
    expect(msg: string, ...debug: Labels[]): T {
      return value;
    },
    map<R>(fn: (i: T) => R): Some<R> {
      return Some([value].map(fn).pop());
    },
  };
}

export function None<T>(): None<T> {
  return {
    or(o: T): T {
      return o;
    },
    unwrap(): never {
      return pitch("no value");
    },
    expect(msg: string, ...debug: Labels[]): never {
      return pitch(msg, ...debug);
    },
    map<R>(_fn: (i: T) => R): None<R> {
      return None();
    },
  };
}

export function isSome<T>(x: Option<T>): x is Some<T> {
  return "value" in x;
}

export function isNone<T>(x: Option<T>): x is None<T> {
  return !("value" in x);
}
