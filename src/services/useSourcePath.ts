import { useEffect, useState } from "react";

const KEY = "CATALOG_SOURCE_PATH";

const useSourcePath = () => {
  const [path, setPath] = useState<string>("");

  const refreshPath = () => {
    const refreshedPath = localStorage.getItem(KEY);
    setPath(refreshedPath || "");
    return refreshedPath;
  };

  const setSourcePath = (path: string) => {
    localStorage.setItem(KEY, path);
    refreshPath();
  };

  useEffect(() => {
    refreshPath();
  }, []);

  return { sourcePath: path, setSourcePath };
};

export default useSourcePath;
