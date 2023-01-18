import { PageStatus } from "@/models";
import { PagesContext } from "@/services/context/pagesContext";
import { createStyles, Group } from "@mantine/core";
import { useContext, useMemo } from "react";

const useStyles = createStyles(() => ({
  stat: {
    whiteSpace: "nowrap",
  },
}));

const CatalogStats: React.FC = () => {
  const { classes } = useStyles();
  const { pageIds, pages } = useContext(PagesContext);

  const total: number = pageIds.length;
  const enabledCount: number = useMemo(
    () =>
      pageIds.filter((pageId) => pages?.[pageId]?.status === PageStatus.enable)
        .length,
    [pageIds, pages]
  );

  const disabledCount: number = useMemo(
    () =>
      pageIds.filter((pageId) => pages?.[pageId]?.status !== PageStatus.enable)
        .length,
    [pageIds, pages]
  );

  return (
    <Group>
      <span className={classes.stat}>Ilość stron: {total}</span>
      <span className={classes.stat}>Aktywne: {enabledCount}</span>
      <span className={classes.stat}>Nieaktywne: {disabledCount}</span>
    </Group>
  );
};

export default CatalogStats;
