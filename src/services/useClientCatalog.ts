import { useAppDispatch, useAppSelector } from "./redux";
import { clientPagesStore } from "./store/clientPagesStore";
import { RootState } from "@/store";

export const useClientCatalog = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.clientPages.data);
  const isLoading = useAppSelector(
    (state: RootState) => state.clientPages.isLoading
  );
  const error = useAppSelector((state: RootState) => state.clientPages.error);

  const fetch = () => {
    dispatch(clientPagesStore.actions.FETCH());
  };

  return {
    fetch,
    isLoading,
    error,
    data,
  };
};

export default useClientCatalog;
