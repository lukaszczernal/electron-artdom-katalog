import { useEffect } from "react";
import {
  useClientCatalogUpdate,
  useClientFileUpdate,
  useCompareCatalog,
  usePdfGenerateCatalog,
  useSwitch,
} from "@/services";
import {
  ActionIcon,
  Affix,
  Button,
  Group,
  List,
  Modal,
  Stack,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconCircleCheck, IconFileExport } from "@tabler/icons";
import { AsyncSection } from "@/components/AsyncSection";
import { SOURCE_FILE_NAME } from "@/constants";
import { ListItem } from "./components/ListItem";
import { ErrorMessage } from "../ErrorMessage";

const Generate: React.FC = () => {
  const { status: generateCatalogStatus } = usePdfGenerateCatalog();
  const { fileUpdateStatus } = useClientFileUpdate();
  const {
    updateCatalog,
    clearUpdateStatus,
    error: catalogUpdateError,
    isLoading: isCatalogUpdating,
  } = useClientCatalogUpdate();

  // TOOD this is triggered on application startup - should only be triggered when modal is open
  const {
    compare,
    isLoading: isLoadingClientCatalog,
    allChangedPages,
  } = useCompareCatalog();

  const {
    state: isSyncModalOpen,
    setOn: openSyncModal,
    setOff: closeSyncModal,
  } = useSwitch();

  const onCatalogUpdate = () => {
    updateCatalog(allChangedPages);
  };

  useEffect(() => {
    isSyncModalOpen && compare();
    return () => clearUpdateStatus(); // TODO this should be a side effect of CLIENT_CATALOG_UPDATE_CLEAR
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
        title="Aktualizacja katalogu"
        size="lg"
      >
        <AsyncSection isLoading={isLoadingClientCatalog}>
          <Stack spacing="xl">
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck size={16} />
                </ThemeIcon>
              }
            >
              <ListItem
                text="Generuj plik PDF dla iPad"
                status={generateCatalogStatus}
              />
              {allChangedPages.map(({ fileId }) => (
                <ListItem
                  key={fileId}
                  text={`Aktualizuj: ${fileId}`}
                  status={fileUpdateStatus[fileId]}
                />
              ))}
              <ListItem
                text="Aktualizuj listę stron"
                status={fileUpdateStatus[SOURCE_FILE_NAME]}
              />
            </List>

            {catalogUpdateError && (
              <ErrorMessage
                message="Aktualizacja katalogu klientów nie powiodła się."
                error={catalogUpdateError}
              />
            )}

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
