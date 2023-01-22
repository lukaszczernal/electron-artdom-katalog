import { PagesContext } from "@/services/context/pagesContext";
import { SourcePathContext } from "@/services/context/sourcePathContext";
import { useContext } from "react";
import { Thumbnail } from "../Thumbnail";
import { ThumbnailAction } from "../ThumbnailAction";

export interface Props {
  pageId: string;
  onSelect: (pageId: string | null) => void;
  onPreview: (pageId: string) => void;
}

const PageTile: React.FC<Props> = ({ pageId, onSelect, onPreview }) => {
  const { pages } = useContext(PagesContext);
  const { sourcePath } = useContext(SourcePathContext);

  const page = pages?.[pageId];
  const isDisabled = page?.status !== "enable";
  const imageSrc = `safe-file-protocol://${sourcePath}/jpg/thumb/${page?.svg.file}.jpg?cache=${page?.version}`;

  const selectPage = () => onSelect(pageId);

  return (
    <>
      <ThumbnailAction
        page={page}
        mainAction={onPreview}
        secondaryAction={selectPage}
      >
        <Thumbnail disabled={isDisabled} src={imageSrc} />
      </ThumbnailAction>
    </>
  );
};

export default PageTile;
