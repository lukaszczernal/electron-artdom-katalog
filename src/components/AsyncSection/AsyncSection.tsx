import { Loader } from "@mantine/core";

interface Props {
  error?: string;
  isLoading: boolean;
  children: React.ReactElement;
}

// TODO
// add styling
// add centering and justification

const AsyncSection: React.FC<Props> = ({ children, isLoading, error }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return children;
};

export default AsyncSection;
