import { useClientFileRemove, useClientFileUpload } from "@/services";
import { Stack } from "@mantine/core";

interface Props {
  list: string[];
}

export const FileList: React.FC<Props> = ({ list }) => {
  const { upload, uploadAll, uploadFileStatus } = useClientFileUpload();
  const { removeFile, removeFileStatus } = useClientFileRemove();

  const onUpload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const pageId = e.currentTarget.dataset.pageid;
    pageId && upload(pageId);
  };

  const onUploadAll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    uploadAll(list);
  };

  const onRemove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const pageId = e.currentTarget.dataset.pageid;
    pageId && removeFile(pageId);
  };

  return (
    <ul>
      <li>
        <a href="" onClick={onUploadAll}>
          Upload
        </a>
      </li>
      {list.map((pageId) => (
        <li key={pageId}>
          <Stack spacing="xs">
            <span>{pageId}</span>
            <a href="" data-pageid={pageId} onClick={onUpload}>
              Add
            </a>
            <a href="" data-pageid={pageId} onClick={onRemove}>
              Remove
            </a>
            <span>Upload status: {uploadFileStatus[pageId]}</span>
            <span>Removal status: {removeFileStatus[pageId]}</span>
            {/* {uploadStatus[pageId] === 'uploading' && (
              <span>
                <Loader size="xs" />
              </span>
            )} */}
          </Stack>
        </li>
      ))}
    </ul>
  );
};
