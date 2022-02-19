import type { Labels } from "./label.ts";

import { pitch } from "./err.ts";
import { Safe } from "./result.ts";

export type Json = JsonVal | JsonRec | Json[];
export type JsonVal = string | number | boolean | null;
export type JsonRec = { [k: string]: Json };

export function parseJson(x: string, ...debug: Labels[]) {
  try {
    return JSON.parse(x);
  } catch (_) {
    const str = `${x.substring(0, 32)}...`;
    return pitch("invalid json", { str }, ...debug);
  }
}

export const parseJsonSafe = Safe(JSON.parse);
