import { isLabeled, Labeled, Labels, labels } from "./label";

export type Err = Labeled<Error>;

export function Err(msg: string | Error, ...debug: Labels[]): Err {
  if (typeof msg === "string") {
    return Labeled(cloneError(new Error(msg)), ...debug);
  }
  return Labeled(cloneError(msg), ...debug);
}

export function pitch(msg: string | Error, ...debug: Labels[]): never {
  throw Err(msg, ...debug);
}

export function panic(
  msg: string,
  code_label?: number | Labels,
  ...debug: Labels[]
): never {
  if (typeof code_label === "number") {
    const err = Err(msg, ...debug);
    console.error("panic!", msg, labels(err));
    process.exit(code_label);
  }
  const err = Err(msg, code_label, ...debug);
  console.error("panic!", msg, labels(err));
  process.exit(1);
}

export function isErr(x: any): x is Err {
  return typeof x.message === "string" && isLabeled(x);
}

export function fmtErr(x: Error): any[] {
  if (isErr(x)) {
    return [x.message, labels(x)];
  }
  return [x];
}

function cloneError(e: Error): Error {
  const { name, message, stack } = e;
  return {
    name,
    message,
    // stack,
  };
}
