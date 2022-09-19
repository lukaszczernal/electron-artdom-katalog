import { createStyles } from "@mantine/core";

interface Props {
  disabled?: boolean;
  src: string;
  width: number;
}

const useStyles = createStyles(() => ({
  thumbnail: {
    display: "block",
    boxShadow: "5px 5px 20px rgba(40, 40, 40, 0.2)",
    transition: "box-shadow 300ms ease-out, transform 300ms ease-out",

    ["&:hover"]: {
      boxShadow: "8px 13px 35px rgba(0, 0, 0, 0.1)",
      transform: "translate(0, -8px)",
    },
  },
  disabled: {
    opacity: 0.3,
    boxShadow: "1px 1px 3px rgba(40, 40, 40, 0.5)",

    ["&:hover"]: {
      boxShadow: "1px 1px 3px rgba(40, 40, 40, 0.5)",
      transform: 'none',
    },
  },
}));

const Thumbnail: React.FC<Props> = ({ src, width, disabled }) => {
  const { classes } = useStyles();
  return (
    <img
      className={`${classes.thumbnail} ${disabled ? classes.disabled : ""}`}
      src={src}
      width={width}
    />
  );
};

export default Thumbnail;
