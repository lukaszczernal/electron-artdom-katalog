import { useEffect } from "react";
import {
  useClientCatalogUpdate,
  useCompareCatalog,
  usePdfGenerateCatalog,
  useSwitch,
} from "@/services";
import {
  ActionIcon,
  Affix,
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle, IconFileExport } from "@tabler/icons";
import { FileList } from "./components/FileList";
import { AsyncSection } from "@/components/AsyncSection";
import { ClientFileUpdatePayload } from "@/services/store/actions";
import { SOURCE_FILE_NAME } from "@/constants";

const Generate: React.FC = () => {
  const { status: generateCatalogStatus } = usePdfGenerateCatalog();

  const {
    updateCatalog,
    error: catalogUpdateError,
    isLoading: isCatalogUpdating,
  } = useClientCatalogUpdate();

  // TOOD this is triggered on application startup - should only be triggered when modal is open
  const {
    compare,
    isLoading: isLoadingClientCatalog,
    error: clientCatalogError,
    updatedPages,
    newPages,
    removedPages,
  } = useCompareCatalog();

  const {
    state: isSyncModalOpen,
    setOn: openSyncModal,
    setOff: closeSyncModal,
  } = useSwitch();

  const onCatalogUpdate = () => {
    const uploadPages: ClientFileUpdatePayload[] = updatedPages
      .concat(newPages)
      .map((fileId) => ({
        type: "upload",
        fileId,
      }));

    const removePages: ClientFileUpdatePayload[] = removedPages.map(
      (fileId) => ({
        type: "remove",
        fileId,
      })
    );

    const updatePages = uploadPages.concat(removePages);
    updateCatalog(updatePages);
  };

  useEffect(() => {
    isSyncModalOpen && compare();
  }, [isSyncModalOpen]);

  return (
    <>
      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 16 }}>
          <ActionIcon
            loading={isCatalogUpdating}
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
            {catalogUpdateError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Nie udało się"
                color="red"
              >
                <>
                  <p>Aktualizacja katalogu nie powiodła się.</p>
                  <span>(Błąd: {catalogUpdateError})</span>;
                </>
              </Alert>
            )}

            {updatedPages?.length > 0 && (
              <>
                <span>Zaktualizowane strony: {updatedPages?.length}</span>
                <FileList list={updatedPages} />
              </>
            )}

            {newPages?.length > 0 && (
              <>
                <span>Nowe strony: {newPages?.length}</span>
                <FileList list={newPages} />
              </>
            )}

            {removedPages?.length > 0 && (
              <>
                <span>Usunięte strony: {removedPages?.length}</span>
                <FileList list={removedPages} />
              </>
            )}

            <span>Generowane pliku PDF {generateCatalogStatus}</span>

            <span>Dane katalogu:</span>
            <FileList list={[SOURCE_FILE_NAME]} />

            <Group position="right">
              <Button onClick={closeSyncModal}>Anuluj</Button>
              <Button onClick={onCatalogUpdate} disabled={isCatalogUpdating}>
                Aktualizuj katalog
              </Button>
            </Group>
          </Stack>
        </AsyncSection>
      </Modal>
    </>
  );
};

export default Generate;
