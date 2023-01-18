import { useEffect } from "react";
import { EventError } from "@/models";
import {
  useCompareCatalog,
  useGenerateCatalog,
  useSwitch,
  useUpdateCatalog,
} from "@/services";
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
import { CatalogStats } from "../CatalogStats";

const FileList: React.FC<{
  action: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  altAction: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  list: string[];
  children?: React.ReactElement;
}> = ({ action, altAction, list, children }) => {
  return (
    <>
      {children}
      <ul>
        {list.map((pageId) => (
          <li key={pageId}>
            <Group>
              <span>{pageId}</span>
              <a href="" data-pageid={pageId} onClick={action}>
                Add
              </a>
              <a href="" data-pageid={pageId} onClick={altAction}>
                Remove
              </a>
            </Group>
          </li>
        ))}
      </ul>
    </>
  );
};

const Generate: React.FC = () => {
  const {
    fetch: generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
  } = useGenerateCatalog();

  const { compare, updatedPages, newPages, removedPages } = useCompareCatalog();

  const { upload, uploadPageError, remove, removePageError, onRemoveFinish, removeResponse } =
    useUpdateCatalog();

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

  const onUpload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const pageId = e.currentTarget.dataset.pageid;
    upload(pageId);
  };

  const onRemove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const pageId = e.currentTarget.dataset.pageid;
    remove(pageId);
  };

  useEffect(() => {
    // const onRemoveFinishSub = onRemoveFinish.subscribe((res) =>
    //   console.log("onRemoveFinish", res)
    // );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateError,
    });

    return () => {
      onGenerateCatalogFinishSub.unsubscribe();
      // onRemoveFinishSub.unsubscribe();
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
          <CatalogStats />
          <Button onClick={compare}>Analizuj zmiany</Button>
          {/* {uploadPageError && <span>Upload error: {uploadPageError}</span>}
          {removePageError && <span>Remove error: {removePageError}</span>} */}

          <FileList list={updatedPages} action={onUpload} altAction={onRemove}>
            {updatedPages.length > 0 ? (
              <span>Zmienione strony: {updatedPages?.length}</span>
            ) : undefined}
          </FileList>

          <FileList list={newPages} action={onUpload} altAction={onRemove}>
            {newPages.length > 0 ? (
              <span>Dodane strony: {newPages?.length}</span>
            ) : undefined}
          </FileList>

          <FileList list={removedPages} action={onUpload} altAction={onRemove}>
            {removedPages.length > 0 ? (
              <span>Usunięte strony: {removedPages?.length}</span>
            ) : undefined}
          </FileList>

          <Group position="right">
            <Button onClick={closeSyncModal}>Anuluj</Button>
            <Button onClick={onGenerate}>Generuj</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Generate;
