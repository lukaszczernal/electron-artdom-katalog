import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from './store/actions';

const useDownloadPage = () => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state: RootState) => state.download.isLoading
  );
  const error = useAppSelector((state: RootState) => state.download.error);
  const status = useAppSelector((state: RootState) => state.download.status);
  const progress = useAppSelector(
    (state: RootState) => state.download.progress
  );

  const fetch = (srcPath: string) => {
    dispatch(ACTIONS.APP_DOWNLOAD(srcPath));
  };

  return {
    fetch,
    isLoading,
    error,
    status,
    progress,
  };
};

export default useDownloadPage;
