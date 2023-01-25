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
import { IconFilePlus, IconX } from "@tabler/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAddPage } from "./services";
import { debounceTime, ReplaySubject } from "rxjs";
import { Settings } from "./components/Settings";
import { PageList } from "./components/PageList";
import { PagesContext } from "./services/context/pagesContext";
import { SourcePathContext } from "./services/context/sourcePathContext";
import { PageDetails } from "./components/PageDetails";
import { PagePreview } from "./components/PagePreview";
import { Generate } from "./components/Generate";

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

  const { addPage } = useAddPage();

  useEffect(() => {
    if (sourcePath) {
      fetchPages();
    }
  }, [sourcePath, fetchPages]);

  useEffect(() => {
    regiserPath?.();
  }, [regiserPath]);

  useEffect(() => {
    const searchModeSub = searchPhraseStream
      .pipe(debounceTime(500))
      .subscribe((phrase) => {
        setSearchMode(phrase.length > 0);
        searchPages(phrase);
      });

    return () => {
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

      <Generate />

      <Tooltip label="Dodaj nową stronę" position="left" withArrow>
        <Affix position={{ bottom: 40, right: 16 }}>
          <FileButton onChange={addPage} accept="image/svg">
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
