import { useAppDispatch, useAppSelector } from "./redux";
import { clientFileRemoveStore } from "./store/clientFileRemoveStore";
import { RootState } from "@/store";

const useClientFileRemove = () => {
  const dispatch = useAppDispatch();

  const removeFileStatus = useAppSelector(
    (state: RootState) => state.clientFileRemove.status
  );

  const removeFile = (srcPath: string) => {
    dispatch(clientFileRemoveStore.actions.TRIGGER(srcPath));
  };

  return {
    removeFile,
    removeFileStatus
  };
};

export default useClientFileRemove;
