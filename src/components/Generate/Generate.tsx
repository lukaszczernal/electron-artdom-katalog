import { EventError } from "@/models";
import { useGenerateCatalog, useSwitch } from "@/services";
import {
  ActionIcon,
  Affix,
  Button,
  Group,
  Modal,
  Stack,
  Tooltip,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconFileExport } from "@tabler/icons";
import { useEffect } from "react";

const Generate: React.FC = () => {
  const {
    generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
    onStart: onGenerateCatalogStart,
  } = useGenerateCatalog();

  const {
    state: isSyncModalOpen,
    setOn: openSyncModal,
    setOff: closeSyncModal,
  } = useSwitch();

  const onCatalogGenerateStart = () => {
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

  const onCatalogGenerateFinish = (error: EventError) => {
    error
      ? updateNotification({
          id: "catalog-generate",
          title: "Katalog nie został wynegerowany",
          message: <>{error}</>,
          autoClose: true,
        })
      : updateNotification({
          id: "catalog-generate",
          icon: <IconCheck />,
          color: "teal",
          title: "Katalog",
          message: "Wynegerowany pomyślnie.",
          autoClose: true,
        });
  };

  useEffect(() => {
    const onGenerateCatalogStartSub = onGenerateCatalogStart.subscribe(
      onCatalogGenerateStart
    );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateFinish,
    });

    return () => {
      onGenerateCatalogStartSub.unsubscribe();
      onGenerateCatalogFinishSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 16 }}>
          <ActionIcon
            loading={isGeneratingCatalog}
            color="blue"
            size="xl"
            radius="xl"
            variant="filled"
            onClick={openSyncModal}
          >
            <IconFileExport size={18} />
          </ActionIcon>
        </Affix>
      </Tooltip>

      <Modal
        opened={isSyncModalOpen}
        onClose={closeSyncModal}
        title="Synchronizacja z katalogiem klientów"
        size="md"
      >
        <Stack spacing="xl">
          <Group position="right">
            <Button onClick={closeSyncModal}>Anuluj</Button>
            <Button onClick={generate}>Synchronizuj</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Generate;
