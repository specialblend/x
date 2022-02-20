import type { Labels } from "../label";

import { fmtl } from "../fmt";

describe("fmtl", () => {
  type FmtLabelsTest = [string, { input: Record<any, any>; output: Labels }];
  const fmtl_tests: FmtLabelsTest[] = [
    [
      "already label",
      {
        input: { foo: "bar" },
        output: { foo: "bar" },
      },
    ],
    [
      "nested record",
      {
        input: { foo: "bar", baz: { faz: "foo" } },
        output: { foo: "bar" },
      },
    ],
    [
      "shallow record with empty",
      {
        input: { foo: "bar", baz: "" },
        output: { foo: "bar" },
      },
    ],
    [
      "nested record with empty",
      {
        input: { foo: "bar", baz: { faz: "foo" }, bar: "" },
        output: { foo: "bar" },
      },
    ],
  ];
  describe("it formats object into shallow labels", () => {
    test.each(fmtl_tests)("%s", (_, test_case) => {
      expect(fmtl(test_case.input)).toEqual(test_case.output);
    });
  });
});
