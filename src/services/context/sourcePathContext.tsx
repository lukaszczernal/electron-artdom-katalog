import React from "react";
import useSourcePath from '../useSourcePath';

type SourcePathModel = ReturnType<typeof useSourcePath>

interface Props {
  children: React.ReactElement;
}

export const SourcePathContext = React.createContext<SourcePathModel>({} as any);

const SourcePathProvider: React.FC<Props> = ({ children }) => {
  const sourcePathService = useSourcePath();

  return <SourcePathContext.Provider value={sourcePathService}>{children}</SourcePathContext.Provider>;
};

export default SourcePathProvider;
