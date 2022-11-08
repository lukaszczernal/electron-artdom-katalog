import { createStyles } from "@mantine/core";

interface Props {
  onClick?: () => void;
  children: React.ReactElement;
  actions?: React.ReactElement;
}

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    // ref: getRef("link"),
    position: "relative",
    display: "flex",
    justifyContent: "center",
    height: "100%",
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
    rigth: 0,
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

const noop = () => {};

const ThumbnailAction: React.FC<Props> = ({
  actions,
  onClick = noop,
  children,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <a className={classes.link} onClick={onClick}>
        {children}
      </a>
      {actions && <span className={classes.actions}>{actions}</span>}
    </div>
  );
};

export default ThumbnailAction;
