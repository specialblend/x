/* eslint-disable @typescript-eslint/ban-ts-comment */

import { IntGenerator, MockGenerator, StrGenerator } from "../src/gen";

describe("StrGenr", () => {
  describe("with default namespace, salt", () => {
    test("it generates unique strings", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const testGenr = StrGenerator<TestObj>();
      const { foo, bar, baz } = testGenr;
      // @ts-ignore
      const { alpha, bravo, charlie } = testGenr;
      expect(typeof foo).toEqual("string");
      expect(typeof bar).toEqual("string");
      expect(typeof baz).toEqual("string");
      expect(bar).not.toEqual(foo);
      expect(baz).not.toEqual(foo);
      expect(typeof alpha).toEqual("string");
      expect(typeof bravo).toEqual("string");
      expect(typeof charlie).toEqual("string");
      expect(bravo).not.toEqual(alpha);
      expect(charlie).not.toEqual(alpha);
    });
    test("it generates same strings for same namespace, keys", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const testGenr = StrGenerator<TestObj>();
      const test_set_1 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      const test_set_2 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      const test_set_3 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      expect(typeof test_set_1.foo).toEqual("string");
      expect(typeof test_set_1.bar).toEqual("string");
      expect(typeof test_set_1.baz).toEqual("string");
      expect(test_set_2).toEqual(test_set_1);
      expect(test_set_3).toEqual(test_set_1);
    });
    test("it formats strings as expected", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const testGenr = StrGenerator<TestObj>();
      const { foo, bar, baz } = testGenr;
      // @ts-ignore
      const { alpha, bravo, charlie } = testGenr;
      expect({ foo, bar, baz }).toMatchInlineSnapshot(`
        Object {
          "bar": "mock:bar#fcde2b2",
          "baz": "mock:baz#baa5a09",
          "foo": "mock:foo#2c26b46",
        }
      `);
      expect({ alpha, bravo, charlie }).toMatchInlineSnapshot(`
        Object {
          "alpha": "mock:alpha#8ed3f6a",
          "bravo": "mock:bravo#f144a69",
          "charlie": "mock:charlie#b9dd960",
        }
      `);
    });
  });
  describe("with unique namespace", () => {
    test("it generates unique strings", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const namespace = "test";
      const testGenr = StrGenerator<TestObj>(namespace);
      const { foo, bar, baz } = testGenr;
      // @ts-ignore
      const { alpha, bravo, charlie } = testGenr;
      expect(typeof foo).toEqual("string");
      expect(typeof bar).toEqual("string");
      expect(typeof baz).toEqual("string");
      expect(bar).not.toEqual(foo);
      expect(baz).not.toEqual(foo);
      expect(typeof alpha).toEqual("string");
      expect(typeof bravo).toEqual("string");
      expect(typeof charlie).toEqual("string");
      expect(bravo).not.toEqual(alpha);
      expect(charlie).not.toEqual(alpha);
    });
    test("it generates same strings for same namespace, keys", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const namespace = "test";
      const testGenr = StrGenerator<TestObj>(namespace);
      const test_set_1 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      const test_set_2 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      const test_set_3 = (() => {
        const { foo, bar, baz } = testGenr;
        return { foo, bar, baz };
      })();
      expect(typeof test_set_1.foo).toEqual("string");
      expect(typeof test_set_1.bar).toEqual("string");
      expect(typeof test_set_1.baz).toEqual("string");
      expect(test_set_2).toEqual(test_set_1);
      expect(test_set_3).toEqual(test_set_1);
    });
    test("it generates unique strings for same keys, unique namespace", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const namespace1 = "foo";
      const namespace2 = "bar";
      const testGenr1 = StrGenerator<TestObj>(namespace1);
      const testGenr2 = StrGenerator<TestObj>(namespace2);
      const test_set_1 = (() => {
        const { foo, bar, baz } = testGenr1;
        return { foo, bar, baz };
      })();
      const test_set_2 = (() => {
        const { foo, bar, baz } = testGenr2;
        return { foo, bar, baz };
      })();
      expect(typeof test_set_1.foo).toEqual("string");
      expect(typeof test_set_1.bar).toEqual("string");
      expect(typeof test_set_1.baz).toEqual("string");
      expect(typeof test_set_2.foo).toEqual("string");
      expect(typeof test_set_2.bar).toEqual("string");
      expect(typeof test_set_2.baz).toEqual("string");
      expect(test_set_2).not.toEqual(test_set_1);
    });
    test("it formats strings as expected", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const namespace1 = "foo";
      const namespace2 = "bar";
      const testGenr1 = StrGenerator<TestObj>(namespace1);
      const testGenr2 = StrGenerator<TestObj>(namespace2);
      const test_set_1 = (() => {
        const { foo, bar, baz } = testGenr1;
        return { foo, bar, baz };
      })();
      const test_set_2 = (() => {
        const { foo, bar, baz } = testGenr2;
        return { foo, bar, baz };
      })();
      expect(test_set_1).toMatchInlineSnapshot(`
        Object {
          "bar": "foo:bar#fcde2b2",
          "baz": "foo:baz#baa5a09",
          "foo": "foo:foo#2c26b46",
        }
      `);
      expect(test_set_2).toMatchInlineSnapshot(`
        Object {
          "bar": "bar:bar#fcde2b2",
          "baz": "bar:baz#baa5a09",
          "foo": "bar:foo#2c26b46",
        }
      `);
    });
  });
});

describe("IntGenr", () => {
  describe("with default salt", () => {
    test("it generates integers", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const { foo, bar, baz } = IntGenerator<TestObj>();
      expect(typeof foo).toEqual("number");
      expect(Math.round(foo)).toEqual(foo);
      expect(typeof bar).toEqual("number");
      expect(Math.round(bar)).toEqual(bar);
      expect(typeof baz).toEqual("number");
      expect(Math.round(baz)).toEqual(baz);
    });
    test("it generates same integers for same salt", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const { foo, bar, baz } = IntGenerator<TestObj>();
      expect({ foo, bar, baz }).toMatchInlineSnapshot(`
        Object {
          "bar": 18,
          "baz": 89,
          "foo": 78,
        }
      `);
    });
  });
  describe("with integer salt", () => {
    test("it generates integers", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const salt = 1337;
      const { foo, bar, baz } = IntGenerator<TestObj>(salt);
      expect(typeof foo).toEqual("number");
      expect(Math.round(foo)).toEqual(foo);
      expect(typeof bar).toEqual("number");
      expect(Math.round(bar)).toEqual(bar);
      expect(typeof baz).toEqual("number");
      expect(Math.round(baz)).toEqual(baz);
    });
    test("it generates same integers for same salt", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const salt = 1337;
      const { foo, bar, baz } = IntGenerator<TestObj>(salt);
      expect({ foo, bar, baz }).toMatchInlineSnapshot(`
        Object {
          "bar": 2,
          "baz": 73,
          "foo": 62,
        }
      `);
    });
  });
  describe("with float salt", () => {
    test("it generates integers", () => {
      type TestObj = {
        foo: string;
        bar: number;
        baz: string;
      };
      const salt = Math.random();
      const { foo, bar, baz } = IntGenerator<TestObj>(salt);
      expect(typeof foo).toEqual("number");
      expect(Math.round(foo)).toEqual(foo);
      expect(typeof bar).toEqual("number");
      expect(Math.round(bar)).toEqual(bar);
      expect(typeof baz).toEqual("number");
      expect(Math.round(baz)).toEqual(baz);
    });
  });
});

describe("MockGenr", () => {
  test("it generates jest mock functions", () => {
    type TestApi = {
      foo(): Promise<string>;
      bar(): Promise<number>;
    };
    const { foo, bar } = MockGenerator<TestApi>();
    expect(typeof foo).toEqual("function");
    expect(typeof bar).toEqual("function");
    expect(typeof foo.mockClear).toEqual("function");
    expect(typeof bar.mockClear).toEqual("function");
  });
});
