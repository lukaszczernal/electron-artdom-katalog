import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { EventError } from "@/models";

export const catalogGenerateStartNotification = () => {
  showNotification({
    id: "catalog-generate",
    color: "teal",
    title: "Katalog",
    message: "Trwa generowanie",
    disallowClose: true,
    loading: true,
    autoClose: false,
  });
};

export const catalogGenerateFinishNotification = () => {
  updateNotification({
    id: "catalog-generate",
    icon: <IconCheck />,
    color: "teal",
    title: "Katalog",
    message: "Wynegerowany pomyślnie.",
    autoClose: true,
  });
};

export const catalogGenerateErrorNotification = (error: EventError) => {
  updateNotification({
    id: "catalog-generate",
    title: "Katalog nie został wynegerowany",
    message: <>{error}</>,
    autoClose: true,
  });
};
