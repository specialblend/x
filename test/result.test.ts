import { Err, Fail, isFail, isOk, Ok, Safely } from "../src";

describe("Ok", () => {
  test("it returns expected value", () => {
    expect(Ok("hello").status).toEqual("fulfilled");
    expect(Ok("hello").value).toEqual("hello");
    expect(Ok("hello").getOr("world")).toEqual("hello");
    expect(() => Ok("hello").unwrap()).not.toThrow();
    expect(Ok("hello").unwrap()).toEqual("hello");
  });
});

describe("Fail", () => {
  test("it returns expected value", () => {
    expect(Fail("hello", Err("oops")).status).toEqual("rejected");
    expect(Fail("hello", Err("oops")).value).toEqual("hello");
    expect(Fail("hello", Err("oops")).reason).toEqual(Err("oops"));
    expect(Fail("hello", Err("oops")).getOr("world")).toEqual("world");
    expect(() => Fail("hello", Err("oops")).unwrap()).toThrow("oops");
  });
});

describe("isOk", () => {
  test("it returns true when result is Ok", () => {
    expect(isOk(Ok("hello"))).toEqual(true);
  });
  test("it returns false when result is not Ok", () => {
    expect(isOk(Fail("hello", Err("oops")))).toEqual(false);
  });
});

describe("isFail", () => {
  test("it returns true when result is Fail", () => {
    expect(isFail(Fail("hello", Err("oops")))).toEqual(true);
  });
  test("it returns false when result is not Fail", () => {
    expect(isFail(Ok("hello"))).toEqual(false);
  });
});

describe("Safely", () => {
  describe("in sync mode", () => {
    const assertOdd = jest.fn((x) => {
      if (x % 2 === 0) {
        throw new Error("x is not odd");
      }
      return x;
    });
    const safelyAssertOdd = Safely(assertOdd);
    test("assertOdd throws when x is even", () => {
      expect(() => assertOdd(2)).toThrow("x is not odd");
    });
    test("assertOdd does not throw when x is odd", () => {
      expect(() => assertOdd(1)).not.toThrow();
    });
    test("Safely(assertOdd) returns Fail result when x is even", () => {
      expect(() => safelyAssertOdd(2)).not.toThrow();
      expect(isFail(safelyAssertOdd(2))).toEqual(true);
      expect(() => safelyAssertOdd(2).unwrap()).toThrow("x is not odd");
    });
    test("Safely(assertOdd) returns Ok result when x is odd", () => {
      expect(() => safelyAssertOdd(1)).not.toThrow();
      expect(isOk(safelyAssertOdd(1))).toEqual(true);
      expect(safelyAssertOdd(1).unwrap()).toEqual(1);
    });
  });
});
