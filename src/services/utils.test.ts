import { describe, expect, test } from "vitest";
import { isFilenameValid } from "./utils";

describe("utils", () => {
  test("isFilenameValid", () => {
    expect(isFilenameValid("1-KUBKI_czerwone.svg")).toBeTruthy();
    expect(isFilenameValid("1-KPL.SARA,KLOS.SVG")).toBeTruthy();
    expect(
      isFilenameValid("1-KUBKI_czerwone-2024-12-27_18-09-22.svg")
    ).toBeTruthy();
    expect(
      isFilenameValid("1-KUBKI_czerwone.svg-2023-12-21_18-10-20")
    ).toBeFalsy();
  });
});
