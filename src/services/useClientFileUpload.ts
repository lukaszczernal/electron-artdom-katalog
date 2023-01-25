import { useAppDispatch, useAppSelector } from "./redux";
import { clientFileUploadStore } from "./store/clientFileUploadStore";
import { RootState } from "@/store";

const useClientFileUpload = () => {
  const dispatch = useAppDispatch();

  const uploadFileStatus = useAppSelector(
    (state: RootState) => state.clientFileUpload.status
  );

  const upload = (srcPath: string) => {
    dispatch(clientFileUploadStore.actions.TRIGGER(srcPath));
  };

  return {
    upload,
    uploadFileStatus
  };
};

export default useClientFileUpload;
