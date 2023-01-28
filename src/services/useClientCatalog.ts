import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from './store/actions';

const useClientCatalog = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.clientCatalog.data);
  const isLoading = useAppSelector(
    (state: RootState) => state.clientCatalog.isLoading
  );

  const error = useAppSelector((state: RootState) => state.clientCatalog.error);

  const fetch = () => {
    dispatch(ACTIONS.CLIENT_CATALOG());
  };

  return {
    fetch,
    isLoading,
    error,
    data,
  };
};

export default useClientCatalog;
