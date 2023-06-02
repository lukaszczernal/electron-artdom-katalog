import { Page } from "@/models";
import { Button, createStyles } from "@mantine/core";
import { useCallback } from "react";

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
    padding: "2px",
    borderRadius: "2px",

    ["&:hover"]: {
      padding: "0",
      border: `2px solid ${theme.colors.blue[2]}`,

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
  pasteAnchor: {
    position: "absolute",
    left: "0px",
    width: "36px",
    height: "100%",

    ["&:hover"]: {
      // TODO div should be changed to getRef('link')
      "> div": {
        transition: "height .1s ease-in",
        height: "20%",
      }
    },
  },
  pasteButton: {
    position: "absolute",
    top: "50%",
    left: "18px",
    backgroundColor: theme.colors.blue[4],
    width: "18px",
    height: "18px",
    transform: "translateY(-50%)",
    borderRadius: "9px",
  }
}));

const ThumbnailAction: React.FC<Props> = ({
  mainAction,
  secondaryAction,
  children,
  page,
}) => {
  const { classes } = useStyles();

  // TODO move callbacks outside?
  const onMainAction = useCallback(
    () => page && mainAction(page.svg.file),
    [page]
  );
  const onSecondaryAction = useCallback(
    () => page && secondaryAction(page),
    [page]
  );

  return (
    <>
      <div className={classes.wrapper}>
        <a className={classes.link} onClick={onMainAction}>
          {children}
        </a>
        <span className={classes.actions}>
          <Button size="xs" variant="filled" onClick={onSecondaryAction}>
            Szczegóły
          </Button>
        </span>
      </div>
      <div className={classes.pasteAnchor}>
        <div className={classes.pasteButton} />
      </div>
    </>
  );
};

export default ThumbnailAction;
