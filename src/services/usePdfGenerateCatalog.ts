import { useAppDispatch, useAppSelector } from "./redux";
import { RootState } from "@/store";
import { ACTIONS } from "./store/actions";

const usePdfGenerateCatalog = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(
    (state: RootState) => state.pdfGenerate.status
  );

  const generatePdf = () => {
    dispatch(ACTIONS.PDF_GENERATE());
  };

  return {
    generatePdf,
    status,
  };
};

export default usePdfGenerateCatalog;
