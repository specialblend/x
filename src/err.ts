import { isLabeled, Labeled, labeled, Labels, labels } from "./label.ts";

export interface Err extends Labeled<Error> {
  code: number;
  message: string;
}

export function Err(
  msg: string | Error,
  code_or_labels?: number | Labels,
  ...debug: Labels[]
): Err {
  const err = typeof msg === "string" ? new Error(msg) : msg;
  if (typeof code_or_labels === "undefined") {
    return labeled(Object.assign(err, { code: 1 }), ...debug);
  }
  if (typeof code_or_labels === "number") {
    return labeled(
      Object.assign(err, { code: code_or_labels }),
      ...debug,
    );
  }
  return labeled(
    Object.assign(err, { code: 1 }),
    code_or_labels,
    ...debug,
  );
}

export function pitch(
  msg: string,
  code_or_labels?: number | Labels,
  ...debug: Labels[]
): never {
  throw Err(msg, code_or_labels, ...debug);
}

export function panic(
  msg: string,
  code_label?: number | Labels,
  ...debug: Labels[]
): never {
  const err = Err(msg, code_label, ...debug);
  console.error("panic!", msg, labels(err));
  Deno.exit(err.code);
}

export function isErr(x: any): x is Err {
  return typeof x.message === "string" &&
    typeof x.code === "number" &&
    isLabeled(x);
}
