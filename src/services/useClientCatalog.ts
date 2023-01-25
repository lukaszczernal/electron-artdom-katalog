import { useAppDispatch, useAppSelector } from "./redux";
import { clientCatalogStore } from "./store/clientCatalogStore";
import { RootState } from "@/store";

const useClientCatalog = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.clientCatalog.data);
  const isLoading = useAppSelector(
    (state: RootState) => state.clientCatalog.isLoading
  );

  const error = useAppSelector((state: RootState) => state.clientCatalog.error);

  const fetch = () => {
    dispatch(clientCatalogStore.actions.TRIGGER());
  };

  return {
    fetch,
    isLoading,
    error,
    data,
  };
};

export default useClientCatalog;
