import { Loader } from "@mantine/core";
import { ErrorMessage } from "../ErrorMessage";

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
    return <ErrorMessage error={error} />;
  }

  return children;
};

export default AsyncSection;
