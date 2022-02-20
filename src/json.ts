import { Safely } from "./result";
import { pitch } from "./err";

export type Json = JsonVal | JsonRec | Json[];
export type JsonVal = string | number | boolean | null;
export type JsonRec = { [k: string]: Json };

export function parseJson<T extends JsonRec>(x: string): T {
  try {
    return JSON.parse(x);
  } catch (_) {
    const str = `${x.substring(0, 32)}...`;
    return pitch("invalid json", { str });
  }
}

export const parseJsonSafe = Safely(parseJson);
