import {
  ActionIcon,
  Affix,
  Center,
  createStyles,
  Drawer,
  FileButton,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconFileExport, IconFilePlus, IconX } from "@tabler/icons";
import { EventError } from "./models";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGenerateCatalog, useUploadPage } from "./services";
import { ReplaySubject } from "rxjs";
import { Settings } from "./components/Settings";
import { showNotification, updateNotification } from "@mantine/notifications";
import { PageList } from "./components/PageList";
import { PagesContext } from "./services/context/pagesContext";
import { SourcePathContext } from "./services/context/sourcePathContext";
import { PageDetails } from "./components/PageDetails";
import { PagePreview } from "./components/PagePreview";

const useStyles = createStyles(() => ({
  header: {
    height: "60px",
    display: "flex",
    alignItems: "center",
  },
}));

const App: React.FC = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [pagePreview, setPagePreview] = useState<string | null>();

  const searchPhraseStream = useMemo(() => new ReplaySubject<string>(), []);

  const [searchMode, setSearchMode] = useState(false);

  const { sourcePath, regiserPath } = useContext(SourcePathContext);
  const { pageIds, fetchPages, searchPages } = useContext(PagesContext);

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const { uploadPage } = useUploadPage();
  const {
    generate,
    isLoading: isGeneratingCatalog,
    onFinish: onGenerateCatalogFinish,
    onStart: onGenerateCatalogStart,
  } = useGenerateCatalog();

  // TODO move catalog-creation code to separate module
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
    if (sourcePath) {
      fetchPages();
    }
  }, [sourcePath, fetchPages]);

  useEffect(() => {
    regiserPath?.();
  }, [regiserPath]);

  useEffect(() => {
    const onGenerateCatalogStartSub = onGenerateCatalogStart.subscribe(
      onCatalogGenerateStart
    );

    const onGenerateCatalogFinishSub = onGenerateCatalogFinish.subscribe({
      next: onCatalogGenerateFinish,
      error: onCatalogGenerateFinish,
    });

    const searchModeSub = searchPhraseStream
      // TODO debounce
      .subscribe((phrase) => {
        setSearchMode(phrase.length > 0);
        searchPages(phrase);
      });

    return () => {
      onGenerateCatalogFinishSub.unsubscribe();
      onGenerateCatalogStartSub.unsubscribe();
      searchModeSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <div>
        <Center>
          <header className={classes.header}>Katalog Produktów</header>
        </Center>
        <PageList
          list={pageIds}
          sortDisabled={searchMode}
          onPagePreview={setPagePreview}
          onPageSelect={setSelectedPageId}
        />
      </div>

      <Affix position={{ top: 10, right: 16 }}>
        <TextInput
          placeholder="Szukaj..."
          radius="xl"
          onChange={(event) =>
            searchPhraseStream.next(event.currentTarget.value)
          }
          rightSection={
            searchMode && (
              <ActionIcon
                radius="xl"
                variant="filled"
                color={theme.primaryColor}
                onClick={() => searchPhraseStream.next("")}
              >
                <IconX size={18} />
              </ActionIcon>
            )
          }
        />
      </Affix>

      <Tooltip label="Generuj PDF" position="left" withArrow>
        <Affix position={{ bottom: 100, right: 16 }}>
          <ActionIcon
            loading={isGeneratingCatalog}
            color="blue"
            size="xl"
            radius="xl"
            variant="filled"
            onClick={generate}
          >
            <IconFileExport size={18} />
          </ActionIcon>
        </Affix>
      </Tooltip>

      <Tooltip label="Dodaj nową stronę" position="left" withArrow>
        <Affix position={{ bottom: 40, right: 16 }}>
          <FileButton onChange={uploadPage} accept="image/svg">
            {(props) => (
              <ActionIcon
                color="blue"
                size="xl"
                radius="xl"
                variant="filled"
                {...props}
              >
                <IconFilePlus size={18} />
              </ActionIcon>
            )}
          </FileButton>
        </Affix>
      </Tooltip>

      <Settings />

      <Drawer
        opened={Boolean(selectedPageId)}
        onClose={() => setSelectedPageId(null)}
        position="bottom"
        padding="xl"
        size="xl"
      >
        {selectedPageId && (
          <PageDetails
            pageId={selectedPageId}
            onFinish={() => setSelectedPageId(null)}
          />
        )}
      </Drawer>

      {pagePreview && (
        <PagePreview
          selectedPageId={pagePreview}
          list={pageIds}
          onClickOutside={() => setPagePreview(null)}
        />
      )}
    </>
  );
};

export default App;
