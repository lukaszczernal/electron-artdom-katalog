import { Page } from "@/models";
import { Button, createStyles } from "@mantine/core";
import { useCallback } from 'react';

interface Props {
  page?: Page;
  mainAction: (pageId: string) => void;
  secondaryAction: (page: Page) => void;
  children: React.ReactElement;
}

const useStyles = createStyles((theme, _params, _getRef) => ({
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    height: "fit-content;",
    padding: "1px",
    borderRadius: "2px",

    ["&:hover"]: {
      padding: "0",
      border: `1px solid ${theme.colors.blue[2]}`,

      // TODO span should be changed to getRef('link')
      "> span": {
        display: "flex",
      },
    },
  },
  link: {
    position: "relative",
    bottom: "1rem",
    left: 0,
    top: 0,
    right: 0,
    cursor: "pointer",
  },
  actions: {
    position: "absolute",
    bottom: "0.4rem",
    left: 0,
    right: 0,
    display: "none",
    justifyContent: "center",
  },
}));

const ThumbnailAction: React.FC<Props> = ({
  mainAction,
  secondaryAction,
  children,
  page,
}) => {
  const { classes } = useStyles();

  // TODO move callbacks outside?
  const onMainAction = useCallback(() => page && mainAction(page.svg.file), [page]);
  const onSecondaryAction = useCallback(() => page && secondaryAction(page), [page]);

  return (
    <div className={classes.wrapper}>
      <a className={classes.link} onClick={onMainAction}>
        {children}
      </a>
      <span className={classes.actions}>
        <Button size="xs" variant="light" onClick={onSecondaryAction}>
          Szczegóły
        </Button>
      </span>
    </div>
  );
};

export default ThumbnailAction;
