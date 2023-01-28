import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from './store/actions';

const useClientFileUpload = () => {
  const dispatch = useAppDispatch();

  const uploadFileStatus = useAppSelector(
    (state: RootState) => state.clientFileUpload.status
  );

  const upload = (path: string) => {
    dispatch(ACTIONS.CLIENT_FILE_UPLOAD(path));
  };

  const uploadAll = (paths: string[]) => {
    dispatch(ACTIONS.CLIENT_FILE_UPLOAD_ALL(paths));
  };

  return {
    upload,
    uploadAll,
    uploadFileStatus
  };
};

export default useClientFileUpload;
