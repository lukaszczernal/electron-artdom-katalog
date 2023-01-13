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
    padding: "0 1rem 1rem",
    justifyContent: "center",
    width: "50%",
    height: "300px",
    alignContent: "stretch",
    "@media (min-width: 600px)": {
      width: "33%",
    },
    "@media (min-width: 800px)": {
      width: "25%",
    },
    "@media (min-width: 1000px)": {
      width: "20%",
    },
    "@media (min-width: 1400px)": {
      width: "16.6%",
    },
  },
  listDraggable: {
    flexWrap: "wrap",
    display: "flex",
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
