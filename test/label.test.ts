import { isLabeled, Labeled, labels } from "../src/label";

describe("isLabeled", () => {
  test("returns true when obj is labeled", () => {
    expect(isLabeled(Labeled({}))).toEqual(true);
    expect(isLabeled(Labeled({ foo: "bar" }))).toEqual(true);
    expect(isLabeled(Labeled({ foo: "bar" }, { baz: "faz" }))).toEqual(true);
  });
  test("returns false when obj is not labeled", () => {
    expect(isLabeled({})).toEqual(false);
  });
});

describe("labels", () => {
  test("it returns expected labels", () => {
    expect(labels(Labeled({}))).toEqual({});
    expect(labels(Labeled({}, {}))).toEqual({});
    expect(labels(Labeled({ foo: "bar" }))).toEqual({});
    expect(labels(Labeled({ foo: "bar" }, { baz: "faz" }))).toEqual({
      baz: "faz",
    });
    expect(
      labels(Labeled({ foo: "bar" }, { baz: "faz" }, { alpha: "bravo" }))
    ).toEqual({ baz: "faz", alpha: "bravo" });
  });
});
