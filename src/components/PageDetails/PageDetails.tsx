import { usePages, useUpdatePage } from "../../services";
import {
  ActionIcon,
  Button,
  createStyles,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Page } from "electron/models";
import { Keywords } from "../Keywords";
import { IconPlus } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { Thumbnail } from "../Thumbnail";

interface Prosp {
  page: Page;
}

const useStyles = createStyles(() => ({
  overview: {
    display: "flex",
    height: "100%",
  },
  page: {
    padding: "0 1rem",
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

const PageDetails: React.FC<Prosp> = ({ page }) => {
  const { classes } = useStyles();
  const { refreshPage, editPage } = usePages();
  const { updatePage } = useUpdatePage();
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: keywordInitialValues,
  });

  const addKeyword = (values: typeof keywordInitialValues) => {
    const keywords = (page.keywords || []).concat(values.keyword);
    updatePage({...page, keywords});
  };

  const removeKeyword = (key: string) => {
    const keywords = (page.keywords || []).slice();
    const keyIndex = keywords.findIndex((item) => item === key);

    keywords.splice(keyIndex, 1);
    updatePage({...page, keywords});
  }

  return (
    <div className={classes.overview}>
      <div className={classes.page}>
        <Thumbnail src={`png/${page?.svg.file}.png`} width={280} />
      </div>
      <div className={classes.keywords}>
        <Stack>
          <Title order={5}>Słowa Kluczowe</Title>
          <Keywords keywords={page.keywords} onRemove={removeKeyword} />
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
          <Button onClick={() => refreshPage(page?.svg.file)}>Odśwież</Button>
          <Button onClick={() => editPage(page?.svg.path)}>Edytuj</Button>
        </Stack>
      </div>
    </div>
  );
};

export default PageDetails;
