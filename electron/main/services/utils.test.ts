import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { findNewFilename, getCleanFilenameChunks } from "./utils";

describe("utils", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 10, 27, 18, 9, 22));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("getCleanFilenameChunks", () => {
    expect(getCleanFilenameChunks("1-KUBKI_czerwone.svg")).toEqual([
      "1-KUBKI_czerwone",
      ".svg",
    ]);

    expect(
      getCleanFilenameChunks("1-KUBKI_czerwone-2024-12-27_18-09-22.svg")
    ).toEqual(["1-KUBKI_czerwone-2024-12-27_18-09-22", ".svg"]);

    expect(
      getCleanFilenameChunks("1-KUBKI_czerwone.svg-2023-12-21_18-10-20")
    ).toEqual(["1-KUBKI_czerwone", ".svg"]);
  });

  test("findNewFilename", () => {
    vi.spyOn(Date, "now").mockImplementation(() => 1728841199135);

    expect(findNewFilename("1-KUBKI_biale.svg")).toBe(
      "1-KUBKI_biale-2024-11-27_18-09-22.svg"
    );

    expect(findNewFilename("1-KUBKI_czerwone.svg-2023-12-21_18-10-20")).toBe(
      "1-KUBKI_czerwone-2024-11-27_18-09-22.svg"
    );
  });
});
