import React, { useEffect, useState } from "react";
import { GridListProps, VirtuosoGrid } from "react-virtuoso";
import { createStyles } from "@mantine/core";
import { PageTile } from "../PageTile";
import { Props as PageTitleProps } from "../PageTile/PageTile";
import {
  SortableContainer,
  SortableElement,
  SortableElementProps,
} from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import usePages from "@/services/usePages";

interface Props {
  list: string[];
  sortDisabled?: boolean;
  onPageSelect: (pageId: string | null) => void;
  onPagePreview: (pageId: string) => void;
}

interface ContainerProps {
  items: string[];
  sortDisabled?: boolean;
  onSelect: (pageId: string | null) => void;
  onPreview: (page: string) => void;
}

const useStyles = createStyles(() => ({
  viewport: {
    height: "calc(100vh - 60px)",
    width: "100%",
  },
}));

const useListStyles = createStyles(() => ({
  page: {
    display: "flex",
    position: "relative",
    width: "220px",
    // height: "auto",
    height: "280px",
    padding: "0 1rem 1rem",
    justifyContent: "center",
  },
  listDraggable: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
    gap: "0 0.2rem",
    justifyItems: "center",
    padding: "0 1rem",
  },
}));

const SortableItem = SortableElement<SortableElementProps & PageTitleProps>(
  PageTile
);

const VirtuosoListComponent: React.ForwardRefRenderFunction<
  any,
  GridListProps
> = ({ className, children, ...props }, ref) => {
  const { classes } = useListStyles();
  return (
    <div
      ref={ref}
      {...props}
      className={`${className} ${classes.listDraggable}`}
    >
      {children}
    </div>
  );
};

const VirtuosoListComponentForwardRef = React.forwardRef(VirtuosoListComponent);

const SortableList = SortableContainer<ContainerProps>(
  ({ items, onSelect, onPreview, sortDisabled }) => {
    const { classes } = useListStyles();

    return (
      <VirtuosoGrid
        data={items}
        components={{
          Item: ({ className, ...props }) => (
            <div {...props} className={`${className} ${classes.page}`} />
          ),
          List: VirtuosoListComponentForwardRef,
        }}
        itemContent={(index, pageId) =>
          sortDisabled ? (
            <PageTile
              key={pageId}
              pageId={pageId}
              onSelect={onSelect}
              onPreview={onPreview}
            />
          ) : (
            <SortableItem
              key={pageId}
              index={index}
              pageId={pageId}
              onSelect={onSelect}
              onPreview={onPreview}
            />
          )
        }
      />
    );
  }
);

const PageList: React.FC<Props> = ({
  list = [],
  onPageSelect,
  onPagePreview,
  sortDisabled = false,
}) => {
  const { classes } = useStyles();
  const { sortPages } = usePages();
  const [pages, setPages] = useState<string[]>([]);

  // Update local state only if the number of items change
  useEffect(() => {
    setPages(list);
  }, [list.length]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    // Update local state first to make app feel more responsive
    setPages((prev) => arrayMove(prev, oldIndex, newIndex));
    // Updata source data later
    sortPages(oldIndex, newIndex);
  };

  return (
    <div className={classes.viewport}>
      <SortableList
        items={pages}
        onSortEnd={onSortEnd}
        sortDisabled={sortDisabled}
        axis="xy"
        lockAxis="xy"
        pressDelay={200}
        onSelect={onPageSelect}
        onPreview={onPagePreview}
      />
    </div>
  );
};

export default PageList;
