import { ipcRenderer as nodeEventBus } from "electron";
import { useContext, useEffect, useState } from "react";
import { BROWSER_EVENTS as EVENTS } from "@/events";
import { useRefreshPage, useUpdatePage } from "../../services";
import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Page, PageStatus } from "../../models";
import { Keywords } from "../Keywords";
import { IconPlus } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { Thumbnail } from "../Thumbnail";
import { PagesContext } from "@/services/context/pagesContext";
import useEvent from "@/services/useEvent";
import { SourcePathContext } from "@/services/context/sourcePathContext";

interface Prosp {
  pageId: string;
  onFinish: () => void;
}

const useStyles = createStyles(() => ({
  overview: {
    display: "flex",
    height: "100%",
  },
  page: {
    paddingRight: "1rem",
    paddingBottom: "2.4rem",
    width: "300px",
  },
  actions: {
    margin: "0 1rem",
  },
  keywords: {
    flex: 1,
    margin: "0 1rem",
  },
}));

const keywordInitialValues = {
  keyword: "",
};

const PageDetails: React.FC<Prosp> = ({ pageId, onFinish }) => {
  const { classes } = useStyles();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [localPage, setLocalPage] = useState<Page>();
  const { pages, editPage, removePage } = useContext(PagesContext);
  const { sourcePath } = useContext(SourcePathContext);
  const { updatePage } = useUpdatePage();
  const { refreshPage, isLoading } = useRefreshPage();
  const theme = useMantineTheme();

  const page = pages?.[pageId] || null;
  const isPageActive = localPage?.status === "enable";
  const togglePageLabel = isPageActive ? "Ukryj" : "Aktywuj";
  const thumbnailSrc = `safe-file-protocol://${sourcePath}/jpg/client/${page?.svg.file}.jpg?cache=${page?.version}`;

  useEffect(() => {
    page && setLocalPage(page);
  }, [page]);

  useEvent<Page>(EVENTS.PAGE_EDIT_SUCCESS, (_, page) => {
    refreshPage(page);
  });

  useEvent(EVENTS.PAGE_DELETE_SUCCESS, onFinish);

  const form = useForm({
    initialValues: keywordInitialValues,
  });

  const updateKeywords = (keywords: string[]) => {
    if (!localPage) {
      return;
    }

    const updatedPage = { ...localPage, keywords };
    setLocalPage(updatedPage);
    updatePage(updatedPage);
  };

  const addKeyword = (values: typeof keywordInitialValues) => {
    const newKeys = values.keyword.toLowerCase().split(" ");
    const keywords = (localPage?.keywords || []).concat(newKeys);
    updateKeywords(keywords);
    form.reset();
  };

  const removeKeyword = (key: string) => {
    const keywords = (localPage?.keywords || []).slice();
    const keyIndex = keywords.findIndex((item) => item === key);
    keywords.splice(keyIndex, 1);
    updateKeywords(keywords);
  };

  const togglePage = () => {
    if (!localPage) {
      return;
    }

    const updatedPage = {
      ...localPage,
      status:
        localPage?.status === PageStatus.enable
          ? PageStatus.disable
          : PageStatus.enable,
    };
    setLocalPage(updatedPage);
    updatePage(updatedPage);
  };

  const closeConfirmModal = () => {
    setToDelete(null);
  };

  const requestPageDelete = () =>
    setToDelete(localPage ? localPage.svg.file : null);

  const downloadPage = () => {
    nodeEventBus.send(EVENTS.APP_DOWNLOAD, thumbnailSrc);
  }

  return localPage ? (
    <>
      <div className={classes.overview}>
        <div className={classes.page}>
          <Thumbnail
            isLoading={isLoading}
            disabled={!isPageActive}
            src={thumbnailSrc}
          />
        </div>
        <div className={classes.keywords}>
          <Stack>
            <Title order={5}>Słowa Kluczowe</Title>
            <Keywords keywords={localPage.keywords} onRemove={removeKeyword} />
            <form onSubmit={form.onSubmit(addKeyword)}>
              <TextInput
                placeholder="Dodaj słowo kluczowe"
                radius="xl"
                rightSection={
                  <ActionIcon
                    radius="xl"
                    variant="filled"
                    color={theme.primaryColor}
                    onClick={() => addKeyword(form.values)}
                  >
                    <IconPlus size={18} />
                  </ActionIcon>
                }
                {...form.getInputProps("keyword")}
              />
            </form>
          </Stack>
        </div>
        <div className={classes.actions}>
          <Stack spacing="xs">
            <Button onClick={togglePage}>{togglePageLabel}</Button>
            <Button onClick={() => refreshPage(localPage)} disabled={isLoading}>
              Odśwież
            </Button>
            <Button onClick={() => editPage(localPage)}>Edytuj</Button>
            <Button onClick={downloadPage}>Pobierz</Button>
            <Button onClick={requestPageDelete}>Usuń</Button>
          </Stack>
        </div>
      </div>

      <Modal
        opened={Boolean(toDelete)}
        onClose={closeConfirmModal}
        title="Usuwanie strony"
        size="md"
      >
        <Stack spacing="xl">
          <p>Czy napewno chcesz usunąć {toDelete}?</p>
          <Group position="right">
            <Button onClick={closeConfirmModal}>Nie</Button>
            <Button onClick={() => removePage(toDelete)}>Tak</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  ) : null;
};

export default PageDetails;
