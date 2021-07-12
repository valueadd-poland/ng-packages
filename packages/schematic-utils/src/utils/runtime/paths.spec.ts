import { relativePathToWorkspaceRoot } from "./paths";

describe("paths", () => {
  describe("relativePathToWorkspaceRoot", () => {
    it(`should handle root '/'`, () => {
      const result = relativePathToWorkspaceRoot("/");
      expect(result).toBe(".");
    });

    it(`should handle an empty path`, () => {
      const result = relativePathToWorkspaceRoot("");
      expect(result).toBe(".");
    });

    it(`should handle an undefined path`, () => {
      const result = relativePathToWorkspaceRoot(undefined);
      expect(result).toBe(".");
    });

    it(`should handle path with trailing '/'`, () => {
      const result = relativePathToWorkspaceRoot("foo/bar/");
      expect(result).toBe("../..");
    });

    it(`should handle path without trailing '/'`, () => {
      const result = relativePathToWorkspaceRoot("foo/bar");
      expect(result).toBe("../..");
    });
  });
});
