import { isFail, isOk, parseJson, parseJsonSafe } from "../src";

describe("parseJson", () => {
  describe("when str is valid json", () => {
    test("it parses as expected", () => {
      const my_obj = {
        foo: "bar",
      };
      const my_json_str = JSON.stringify(my_obj);
      const my_json = parseJson(my_json_str);
      expect(my_json).toEqual(my_obj);
    });
  });
  describe("when str is invalid json", () => {
    test("it throws", () => {
      const my_obj = {
        foo: "bar",
      };
      const my_json_str = JSON.stringify(my_obj) + "foo";
      expect(() => parseJson(my_json_str)).toThrow("invalid json");
    });
  });
});

describe("parseJsonSafe", () => {
  describe("when str is valid json", () => {
    const my_obj = {
      foo: "bar",
    };
    const my_json_str = JSON.stringify(my_obj);
    const my_json_res = parseJsonSafe(my_json_str);
    test("it returns ok result", () => {
      expect(isOk(my_json_res)).toEqual(true);
    });
    test("it parses as expected", () => {
      expect(my_json_res.getOr({})).toEqual(my_obj);
    });
  });
  describe("when str is invalid json", () => {
    const my_obj = {
      foo: "bar",
    };
    const my_json_str = JSON.stringify(my_obj) + "foo";
    const my_json_res = parseJsonSafe(my_json_str);
    test("it returns failed result", () => {
      expect(isFail(my_json_res)).toEqual(true);
    });
    test("it has expected reason", () => {
      expect(my_json_res.reason.message).toMatch("invalid json");
    });
  });
});
