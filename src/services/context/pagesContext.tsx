import React from "react";
import usePages from '../usePages';

type PagesContextModel = ReturnType<typeof usePages>

interface Props {
  children: React.ReactElement;
}

export const PagesContext = React.createContext<PagesContextModel>({} as any);

const PagesProvider: React.FC<Props> = ({ children }) => {
  const pagesService = usePages();

  return <PagesContext.Provider value={pagesService}>{children}</PagesContext.Provider>;
};

export default PagesProvider;
