import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from './store/actions';

const useClientFileUpdate = () => {
  const dispatch = useAppDispatch();

  const fileUpdateStatus = useAppSelector(
    (state: RootState) => state.clientFileUpdate.status
  );

  const upload = (fileId: string) => {
    dispatch(ACTIONS.CLIENT_FILE_UPDATE({type: 'upload', fileId}));
  };

  const remove = (fileId: string) => {
    dispatch(ACTIONS.CLIENT_FILE_UPDATE({type: 'remove', fileId}));
  };

  return {
    upload,
    remove,
    fileUpdateStatus
  };
};

export default useClientFileUpdate;
