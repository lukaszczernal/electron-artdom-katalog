import { createStyles, LoadingOverlay } from "@mantine/core";

interface Props {
  disabled?: boolean;
  src: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const useStyles = createStyles((theme) => ({
  thumbnail: {
    display: "block",
    boxShadow: "5px 5px 20px rgba(40, 40, 40, 0.2)",
    transition: "box-shadow 300ms ease-out, transform 300ms ease-out",
    height: "100%",
    maxWidth: "100%",
    border: `1px solid ${theme.colors.gray[3]}`,

    ["&:hover"]: {
      boxShadow: "8px 13px 35px rgba(0, 0, 0, 0.1)",
      transform: "translate(0, -8px)",
    },
  },
  disabled: {
    opacity: 0.5,
    boxShadow: "none",
    border: `1px solid ${theme.colors.gray[4]}`,

    ["&:hover"]: {
      boxShadow: "none",
      transform: "none",
    },
  },
  link: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
  },
}));

const noop = () => {};

const Thumbnail: React.FC<Props> = ({
  src,
  disabled,
  isLoading = false,
  onClick = noop,
}) => {
  const { classes } = useStyles();

  return (
    <a className={classes.link} onClick={onClick}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <img
        className={`${classes.thumbnail} ${disabled ? classes.disabled : ""}`}
        src={src}
      />
    </a>
  );
};

export default Thumbnail;
