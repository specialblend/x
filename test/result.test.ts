import { Fail, isFail, isOk, Ok, Safely } from "../src/result";
import { Err } from "../src/err";

describe("Ok", () => {
  test("it has expected status", () => {
    expect(Ok("hello").status).toEqual("fulfilled");
  });
  test("it has expected value", () => {
    expect(Ok("hello").value).toEqual("hello");
  });
  test("or returns original value", () => {
    expect(Ok("hello").or("world")).toEqual("hello");
  });
  test("unwrap does not throw", () => {
    expect(() => Ok("hello").unwrap()).not.toThrow();
  });
  test("expect does not throw", () => {
    expect(() => Ok("hello").expect("oops")).not.toThrow();
  });
});

describe("Fail", () => {
  test("it has expected status", () => {
    expect(Fail("hello", Err("oops")).status).toEqual("rejected");
  });
  test("it has expected value", () => {
    expect(Fail("hello", Err("oops")).value).toEqual("hello");
  });
  test("it has expected reason", () => {
    expect(Fail("hello", Err("oops")).reason.message).toEqual(
      Err("oops").message
    );
  });
  test("or returns fallback value", () => {
    expect(Fail("hello", Err("oops")).or("world")).toEqual("world");
  });
  test("unwrap throws", () => {
    expect(() => Fail("hello", Err("oops")).unwrap()).toThrow("oops");
  });
  test("expect throws", () => {
    expect(() =>
      Fail("hello", Err("oops")).expect("expected not to fail!")
    ).toThrow("expected not to fail!");
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
  describe("in async mode", () => {
    const assertOddAsync = jest.fn(
      //
      async (x) => {
        if (x % 2 === 0) {
          throw new Error("x is not odd");
        }
        return x;
      }
    );
    const safelyAssertOddAsync = Safely(assertOddAsync, Promise);
    test("assertOddAsync throws when x is even", async () => {
      try {
        await assertOddAsync(2);
      } catch (err) {
        expect(err.message).toMatch("x is not odd");
      }
    });
    test("assertOddAsync does not throw when x is odd", async () => {
      const threw = jest.fn();
      expect(await assertOddAsync(1).catch(threw)).toEqual(1);
      expect(threw).not.toHaveBeenCalled();
    });
    test("Safely(assertOddAsync) returns Fail result when x is even", async () => {
      const res = await safelyAssertOddAsync(2);
      expect(isFail(res)).toEqual(true);
      try {
        res.unwrap();
      } catch (err) {
        expect(err.message).toMatch("x is not odd");
      }
    });
    test("Safely(assertOddAsync) returns Ok result when x is odd", async () => {
      expect(isOk(await safelyAssertOddAsync(1))).toEqual(true);
      expect((await safelyAssertOddAsync(1)).unwrap()).toEqual(1);
    });
  });
});
