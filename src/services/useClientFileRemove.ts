import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from "./store/actions";

const useClientFileRemove = () => {
  const dispatch = useAppDispatch();

  const removeFileStatus = useAppSelector(
    (state: RootState) => state.clientFileRemove.status
  );

  const removeFile = (srcPath: string) => {
    dispatch(ACTIONS.CLIENT_FILE_REMOVE(srcPath));
  };

  return {
    removeFile,
    removeFileStatus,
  };
};

export default useClientFileRemove;
