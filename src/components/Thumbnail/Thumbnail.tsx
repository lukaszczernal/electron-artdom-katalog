import { createStyles, LoadingOverlay } from "@mantine/core";

interface Props {
  disabled?: boolean;
  src: string;
  isLoading?: boolean;
}

const useStyles = createStyles((theme) => ({
  thumbnail: {
    boxShadow: "5px 5px 20px rgba(40, 40, 40, 0.2)",
    transition: "box-shadow 300ms ease-out, transform 300ms ease-out",
    height: "100%",
    maxWidth: "100%",
    border: `1px solid ${theme.colors.gray[3]}`,
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
}));

const Thumbnail: React.FC<Props> = ({ src, disabled, isLoading = false }) => {
  const { classes } = useStyles();

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <img
        className={`${classes.thumbnail} ${disabled ? classes.disabled : ""}`}
        src={src}
      />
    </>
  );
};

export default Thumbnail;
