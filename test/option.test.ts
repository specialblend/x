import { isNone, isSome, None, Some } from "../src/option";

describe("Some", () => {
  const some_foo = Some("foo");
  test("has value foo", () => {
    expect(some_foo.value).toEqual("foo");
  });
  test("getOr returns original value", () => {
    expect(some_foo.getOr("bar")).toEqual("foo");
  });
  test("unwrap returns original value", () => {
    expect(some_foo.unwrap()).toEqual("foo");
  });
  test("expect returns original value", () => {
    expect(some_foo.expect("no value")).toEqual("foo");
  });
  test("map returns Some", () => {
    const some_foo_star = some_foo.map((str) => `${str}*`);
    expect(some_foo_star.value).toEqual("foo*");
    expect(some_foo_star.getOr("bar")).toEqual("foo*");
  });
});

describe("None", () => {
  const none_foo = None<string>();
  test("index 0 is undefined", () => {
    expect(none_foo[0]).toBeUndefined();
  });
  test("getOr returns fallback value", () => {
    expect(none_foo.getOr("bar")).toEqual("bar");
  });
  test("unwrap throws", () => {
    expect(() => none_foo.unwrap()).toThrow();
  });
  test("expect throws", () => {
    expect(() => none_foo.expect("missing foo!")).toThrow("missing foo!");
  });
  test("map returns None", () => {
    const none_foo_star = none_foo.map((str) => `${str}*`);
    expect(none_foo_star.value).toBeUndefined();
    expect(none_foo_star.getOr("bar")).toEqual("bar");
  });
});

describe("isSome", () => {
  const some_foo = Some("foo");
  const none_foo = None();
  test("it returns true when is Some", () => {
    expect(isSome(some_foo)).toEqual(true);
  });
  test("it returns false when is None", () => {
    expect(isSome(none_foo)).toEqual(false);
  });
});

describe("isNone", () => {
  const some_foo = Some("foo");
  const none_foo = None();
  test("it returns true when is Some", () => {
    expect(isNone(none_foo)).toEqual(true);
  });
  test("it returns false when is None", () => {
    expect(isNone(some_foo)).toEqual(false);
  });
});
