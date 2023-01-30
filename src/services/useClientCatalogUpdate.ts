import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS, ClientFileUpdatePayload } from "./store/actions";

const useClientCatalogUpdate = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state: RootState) => state.clientCatalogUpdate.isLoading
  );

  const error = useAppSelector(
    (state: RootState) => state.clientCatalogUpdate.error
  );

  const updateCatalog = (pages: ClientFileUpdatePayload[]) => {
    dispatch(ACTIONS.CLIENT_CATALOG_UPDATE(pages));
  };

  return {
    updateCatalog,
    isLoading,
    error,
  };
};

export default useClientCatalogUpdate;
