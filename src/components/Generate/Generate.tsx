import { useEffect } from "react";
import { EventError } from "@/models";
import { useCompareCatalog, useGenerateCatalog, useSwitch } from "@/services";
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

const Generate: React.FC = () => {
  const {
    fetch: generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
    onError: onGenerateCatalogFail,
  } = useGenerateCatalog();

  const { compare, updatedPages, newPages, removedPages } = useCompareCatalog();

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

  const onCatalogGenerateFinish = () => {
    updateNotification({
      id: "catalog-generate",
      icon: <IconCheck />,
      color: "teal",
      title: "Katalog",
      message: "Wynegerowany pomyślnie.",
      autoClose: true,
    });
  };

  const onCatalogGenerateError = (error: EventError) => {
    updateNotification({
      id: "catalog-generate",
      title: "Katalog nie został wynegerowany",
      message: <>{error}</>,
      autoClose: true,
    });
  };

  const onGenerate = () => {
    generate();
    onCatalogGenerateStart();
  };

  useEffect(() => {
    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateError,
    });

    return () => {
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
          <Button onClick={compare}>Fetch clients catalog</Button>
          <span>Updated pages count: {updatedPages?.length}</span>
          <span>New pages count: {newPages?.length}</span>
          <span>Removed pages count: {removedPages?.length}</span>
          <Group position="right">
            <Button onClick={closeSyncModal}>Anuluj</Button>
            <Button onClick={onGenerate}>Synchronizuj</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Generate;
