import { isTagged, Tagged } from "../src";

describe("isTagged", () => {
  test("returns false for non tagged object", () => {
    const tag_foo = Symbol();
    expect(isTagged(tag_foo, {})).toEqual(false);
    expect(isTagged(tag_foo, { foo: "bar" })).toEqual(false);
  });
  test("returns false for non-matching tagged object", () => {
    const tag_foo = Symbol("foo");
    const tag_bar = Symbol("bar");
    const obj = {
      foo: "bar",
    };
    expect(isTagged(tag_foo, Tagged(tag_bar, null, obj))).toEqual(false);
    expect(isTagged(tag_bar, Tagged(tag_foo, null, obj))).toEqual(false);
  });
  test("returns true for matching tagged object", () => {
    const tag_foo = Symbol("foo");
    const tag_bar = Symbol("bar");
    const obj = {
      foo: "bar",
    };
    expect(isTagged(tag_foo, Tagged(tag_foo, null, obj))).toEqual(true);
    expect(isTagged(tag_bar, Tagged(tag_bar, null, obj))).toEqual(true);
  });
});
