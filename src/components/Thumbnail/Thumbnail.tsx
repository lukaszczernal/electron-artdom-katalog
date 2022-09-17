import { createStyles } from "@mantine/core";

interface Props {
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
      transform: "translate(-3px, -8px)",
    },
  },
}));

const Thumbnail: React.FC<Props> = ({ src, width }) => {
  const { classes } = useStyles();
  return <img className={classes.thumbnail} src={src} width={width} />;
};

export default Thumbnail;
