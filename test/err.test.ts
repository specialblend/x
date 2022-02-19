import { Err, iserr, islabeled, labels, panic, pitch } from "../src";

describe("Err", () => {
  describe("when msg is string", () => {
    describe("when called without error code or debug labels", () => {
      const msg = "test error message";
      const err = Err(msg);
      test("it returns Labeled<Error> with code 1, empty labels", () => {
        expect(err instanceof Error).toBe(true);
        expect(err.message).toEqual(msg);
        expect(err.code).toEqual(1);
        expect(islabeled(err)).toBe(true);
        expect(labels(err)).toEqual({});
      });
    });
    describe("when called with error code, without debug labels", () => {
      const msg = "test error message";
      const code = 1234;
      const err = Err(msg, code);
      test("it returns Labeled<Error> with code, empty labels", () => {
        expect(err instanceof Error).toBe(true);
        expect(err.message).toEqual(msg);
        expect(err.code).toEqual(code);
        expect(islabeled(err)).toBe(true);
        expect(labels(err)).toEqual({});
      });
    });
    describe("when called with error code, debug labels", () => {
      const msg = "test error message";
      const code = 1234;
      const label_foo = {
        foo: "bar",
      };
      const label_baz = {
        baz: "faz",
      };
      const debug = [label_foo, label_baz];
      const err = Err(msg, code, ...debug);
      test("it returns Labeled<Error> with code, labels", () => {
        expect(err instanceof Error).toBe(true);
        expect(err.message).toEqual(msg);
        expect(err.code).toEqual(code);
        expect(islabeled(err)).toBe(true);
        expect(labels(err)).toEqual({ ...label_foo, ...label_baz });
      });
    });
    describe("when called without error code, with debug labels", () => {
      const msg = "test error message";
      const label_foo = {
        foo: "bar",
      };
      const label_baz = {
        baz: "faz",
      };
      const debug = [label_foo, label_baz];
      const err = Err(msg, ...debug);
      test("it returns Labeled<Error> with code 1, labels", () => {
        expect(err instanceof Error).toBe(true);
        expect(err.message).toEqual(msg);
        expect(err.code).toEqual(1);
        expect(islabeled(err)).toBe(true);
        expect(labels(err)).toEqual({ ...label_foo, ...label_baz });
      });
    });
  });
});

describe("pitch", () => {
  const msg = "test error message";
  const code = 1234;
  const label_foo = {
    foo: "bar",
  };
  const label_baz = {
    baz: "faz",
  };
  const debug = [label_foo, label_baz];
  test("it throws Labeled<Error>", () => {
    expect(() => pitch(msg)).toThrow(Err(msg));
    expect(() => pitch(msg, code)).toThrow(Err(msg, code));
    expect(() => pitch(msg, code, ...debug)).toThrow(Err(msg, code, ...debug));
    expect(() => pitch(msg, ...debug)).toThrow(Err(msg, ...debug));
  });
});

describe("panic", () => {
  let exit: typeof process.exit;
  let error: typeof console.error;

  beforeAll(() => {
    exit = process.exit;
    error = console.error;
    process.exit = jest.fn((code?): never => {
      throw new Error(String(code));
    });
    console.error = jest.fn(error);
  });

  afterAll(() => {
    process.exit = exit;
    console.error = error;
  });

  describe("when called with msg", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      expect(() => panic(msg)).toThrow("1");
      expect(process.exit).toBeCalledWith(1);
      expect(console.error).toHaveBeenCalledWith("panic!", msg, {});
    });
  });
  describe("when called with msg, code", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      const code = 1234;
      expect(() => panic(msg, code)).toThrow(String(code));
      expect(process.exit).toBeCalledWith(code);
      expect(console.error).toHaveBeenCalledWith("panic!", msg, {});
    });
  });
  describe("when called with msg, code, debug", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      const code = 1234;
      const label_foo = {
        foo: "bar",
      };
      const label_baz = {
        baz: "faz",
      };
      const debug = [label_foo, label_baz];
      expect(() => panic(msg, code, ...debug)).toThrow(String(code));
      expect(process.exit).toBeCalledWith(code);
      expect(console.error).toHaveBeenCalledWith(
        "panic!",
        msg,
        labels(Err(msg, code, ...debug))
      );
    });
  });
  describe("when called with msg, debug", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      const label_foo = {
        foo: "bar",
      };
      const label_baz = {
        baz: "faz",
      };
      const debug = [label_foo, label_baz];
      expect(() => panic(msg, ...debug)).toThrow(String(1));
      expect(process.exit).toBeCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        "panic!",
        msg,
        labels(Err(msg, 1, ...debug))
      );
    });
  });
});

describe("iserr", () => {
  const msg = "test error message";
  const code = 1234;
  const label_foo = {
    foo: "bar",
  };
  const label_baz = {
    baz: "faz",
  };
  const debug = [label_foo, label_baz];
  test("returns true when err is Err", () => {
    expect(iserr(Err(msg))).toBe(true);
    expect(iserr(Err(msg, code))).toBe(true);
    expect(iserr(Err(msg, code, ...debug))).toBe(true);
    expect(iserr(Err(msg, ...debug))).toBe(true);
  });
  test("returns false when err is not Err", () => {
    expect(iserr(new Error(msg))).toBe(false);
  });
});
