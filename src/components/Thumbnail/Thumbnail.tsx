import { createStyles } from "@mantine/core";

interface Props {
  disabled?: boolean;
  src: string;
  onClick?: () => void;
}

const useStyles = createStyles((theme) => ({
  thumbnail: {
    display: "block",
    boxShadow: "5px 5px 20px rgba(40, 40, 40, 0.2)",
    transition: "box-shadow 300ms ease-out, transform 300ms ease-out",
    width: "100%",
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
}));

const noop = () => {};

const Thumbnail: React.FC<Props> = ({ src, disabled, onClick = noop }) => {
  const { classes } = useStyles();
  return (
    <a onClick={onClick}>
      <img
        className={`${classes.thumbnail} ${disabled ? classes.disabled : ""}`}
        src={src}
      />
    </a>
  );
};

export default Thumbnail;
