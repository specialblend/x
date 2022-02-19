import { Err, isErr, isLabeled, labels, panic, pitch } from "../src";

describe("Err", () => {
  describe("when msg is string", () => {
    describe("when called without debug labels", () => {
      const msg = "test error message";
      const err = Err(msg);
      test("it returns Labeled<Error> with empty labels", () => {
        // expect(err instanceof Error).toEqual(true);
        expect(err.message).toEqual(msg);
        expect(isLabeled(err)).toEqual(true);
        expect(labels(err)).toEqual({});
      });
    });
    describe("when called with debug labels", () => {
      const msg = "test error message";
      const label_foo = {
        foo: "bar",
      };
      const label_baz = {
        baz: "faz",
      };
      const debug = [label_foo, label_baz];
      const err = Err(msg, ...debug);
      test("it returns Labeled<Error> with labels", () => {
        // expect(err instanceof Error).toEqual(true);
        expect(err.message).toEqual(msg);
        expect(isLabeled(err)).toEqual(true);
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
    expect(() => pitch(msg, ...debug)).toThrow(Err(msg, ...debug));
    expect(() => pitch(new Error(msg), ...debug)).toThrow(
      Err(new Error(msg), ...debug)
    );
  });
});

describe("panic", () => {
  describe("when called with msg", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      expect(() => panic(msg)).toThrow("1");
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith("panic!", msg, {});
    });
  });
  describe("when called with msg, code", () => {
    test("it prints expected message", () => {
      const msg = "test error message";
      const code = 1234;
      expect(() => panic(msg, code)).toThrow(String(code));
      expect(process.exit).toHaveBeenCalledWith(code);
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
      expect(process.exit).toHaveBeenCalledWith(code);
      expect(console.error).toHaveBeenCalledWith(
        "panic!",
        msg,
        labels(Err(msg, ...debug))
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
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        "panic!",
        msg,
        labels(Err(msg, ...debug))
      );
    });
  });
});

describe("isErr", () => {
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
    expect(isErr(Err(msg))).toEqual(true);
    expect(isErr(Err(msg, ...debug))).toEqual(true);
  });
  test("returns false when err is not Err", () => {
    expect(isErr(new Error(msg))).toEqual(false);
  });
});
