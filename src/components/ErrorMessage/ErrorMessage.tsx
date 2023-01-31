import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

interface Props {
  message?: string;
  error: string;
}

const ErrorMessage = ({ message, error }: Props) => (
  <Alert icon={<IconAlertCircle size={16} />} title="Nie udało się" color="red">
    {message ? (
      <>
        <p>{message}</p>
        <span>(Błąd: {error})</span>;
      </>
    ) : (
      <p>{error}</p>
    )}
  </Alert>
);

export default ErrorMessage;
