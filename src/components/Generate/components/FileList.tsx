import { useClientFileRemove, useClientFileUpload } from "@/services";
import { Group } from "@mantine/core";

export const FileList: React.FC<{
  action: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  altAction: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  list: string[];
}> = ({ action, altAction, list }) => {
  const { uploadFileStatus } = useClientFileUpload();
  const { removeFileStatus } = useClientFileRemove();

  return (
    <ul>
      {list.map((pageId) => (
        <li key={pageId}>
          <Group>
            <span>{pageId}</span>
            <a href="" data-pageid={pageId} onClick={action}>
              Add
            </a>
            <a href="" data-pageid={pageId} onClick={altAction}>
              Remove
            </a>
            <span>Upload status: {uploadFileStatus[pageId]}</span>
            <span>Removal status: {removeFileStatus[pageId]}</span>
            {/* {uploadStatus[pageId] === 'uploading' && (
              <span>
                <Loader size="xs" />
              </span>
            )} */}
          </Group>
        </li>
      ))}
    </ul>
  );
};
