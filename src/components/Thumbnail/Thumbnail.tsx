import { createStyles, LoadingOverlay } from "@mantine/core";

interface Props {
  disabled?: boolean;
  src: string;
  isLoading?: boolean;
}

const useStyles = createStyles((theme) => ({
  thumbnail: {
    boxShadow: "2px 2px 10px rgba(40, 40, 40, 0.1)",
    transition: "box-shadow 300ms ease-out, transform 300ms ease-out",
    maxHeight: "100%",
    maxWidth: "100%",
    border: `1px solid ${theme.colors.gray[3]}`,
  },
  disabled: {
    opacity: 0.3,
    boxShadow: "none",
    border: `1px solid ${theme.colors.gray[4]}`,

    ["&:hover"]: {
      boxShadow: "none",
      transform: "none",
    },
  },
  thumbnailWrapper: {
    background: "rgba(0,0,0,0.1)",
  },
}));

const Thumbnail: React.FC<Props> = ({ src, disabled, isLoading = false }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.thumbnailWrapper}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <img
        loading="lazy"
        className={`${classes.thumbnail} ${disabled ? classes.disabled : ""}`}
        src={src}
      />
    </div>
  );
};

export default Thumbnail;
