import { useEffect } from "react";
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
import { IconFileExport } from "@tabler/icons";
import { CatalogStats } from "../CatalogStats";
import {
  catalogGenerateErrorNotification,
  catalogGenerateFinishNotification,
  catalogGenerateStartNotification,
} from "./notifications";
import { FileList } from "./components/FileList";
import { AsyncSection } from "@/components/AsyncSection";

const Generate: React.FC = () => {
  const {
    fetch: generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
  } = useGenerateCatalog();

  // TOOD this is triggered on application startup - should only be triggered when modal is open
  const {
    compare,
    isLoading: isLoadingClientCatalog,
    error: clientCatalogError,
    totalChanges,
    updatedPages,
    newPages,
    removedPages,
  } = useCompareCatalog();

  const {
    state: isSyncModalOpen,
    setOn: openSyncModal,
    setOff: closeSyncModal,
  } = useSwitch();

  const onGenerate = () => {
    generate();
    catalogGenerateStartNotification();
  };

  useEffect(() => {
    // const onRemoveFinishSub = onRemoveFinish.subscribe((res) =>
    //   console.log("onRemoveFinish", res)
    // );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: catalogGenerateFinishNotification,
      error: catalogGenerateErrorNotification,
    });

    return () => {
      onGenerateCatalogFinishSub.unsubscribe();
      // onRemoveFinishSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    isSyncModalOpen && compare();
  }, [isSyncModalOpen]);

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
        title="Lista zmian"
        size="md"
      >
        <AsyncSection
          isLoading={isLoadingClientCatalog}
          error={clientCatalogError}
        >
          <Stack spacing="xl">
            <span>Liczba zmian: {totalChanges}</span>
            {/* <CatalogStats /> */}
            {/* <Button onClick={compare}>Analizuj zmiany</Button> */}
            {/* {uploadPageError && <span>Upload error: {uploadPageError}</span>}
          {removePageError && <span>Remove error: {removePageError}</span>} */}

            <span>Zaktualizowane strony: {updatedPages?.length}</span>
            <FileList list={updatedPages} />

            <span>Dodane strony: {newPages?.length}</span>
            <FileList list={newPages} />

            <span>Usunięte strony: {removedPages?.length}</span>
            <FileList list={removedPages} />

            <span>Generowane pliku PDF</span>
            <span>Synchronizacja katalogu klientów</span>

            <Group position="right">
              <Button onClick={closeSyncModal}>Anuluj</Button>
              <Button onClick={onGenerate}>Generuj</Button>
            </Group>
          </Stack>
        </AsyncSection>
      </Modal>
    </>
  );
};

export default Generate;
