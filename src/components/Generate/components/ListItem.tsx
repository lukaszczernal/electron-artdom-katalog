import { AsyncStatus } from "@/models/store";
import { List, Loader, ThemeIcon } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck, IconClock } from "@tabler/icons";

interface Props {
  status?: AsyncStatus;
  text: string;
}

const defaultBackgroundColor = "blue";

const iconBackgroundColors = {
  [AsyncStatus.FINISHED]: "teal",
  [AsyncStatus.FAILED]: "red",
};

export const ListItem: React.FC<Props> = ({ status, text }) => {
  const defaultIcon = <IconClock color="white" size={16} />;

  const icons = {
    [AsyncStatus.LOADING]: <Loader color="white" size={16} />,
    [AsyncStatus.FINISHED]: <IconCircleCheck size={16} />,
    [AsyncStatus.FAILED]: <IconAlertCircle size={16} />,
  };

  const backgroundColor =
    (status && iconBackgroundColors[status]) || defaultBackgroundColor;
  const statusIcon = (status && icons[status]) || defaultIcon;

  return (
    <List.Item
      icon={
        <ThemeIcon color={backgroundColor} size={24} radius="xl">
          {statusIcon}
        </ThemeIcon>
      }
    >
      {text}
    </List.Item>
  );
};
