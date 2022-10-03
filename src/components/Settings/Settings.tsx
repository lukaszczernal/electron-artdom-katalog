import os from "os";
import { useState } from "react";
import {
  ActionIcon,
  Affix,
  Button,
  Divider,
  FileButton,
  Modal,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconFileDatabase, IconSettings } from "@tabler/icons";
import { useSourcePath, useUpdateCheck } from "@/services";
import { SOURCE_FILE_NAME } from "@/constants";

const isWindows = os.platform() === "win32";

const Settings: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useMantineTheme();
  const { sourcePath, setSourcePath } = useSourcePath();
  const { checkUpdates, feedURL } = useUpdateCheck();

  const openSettingsModal = () => {
    setModalVisible(true);
  };

  const hideSettingsModal = () => {
    setModalVisible(false);
  };

  const handleSourceSelection = (filePath?: string) => {
    if (!filePath) {
      return;
    }

    const pathDivider = isWindows ? "\\" : "/";

    const pathParts = filePath.split(pathDivider);
    const dataStorageSubPath = pathParts.splice(-2);
    const [_, filename] = dataStorageSubPath;

    if (filename !== SOURCE_FILE_NAME) {
      return;
    }

    setSourcePath(pathParts.join("/"));
  };

  return (
    <>
      <Tooltip label="Ustawienia" position="right" withArrow>
        <Affix position={{ bottom: 40, left: 40 }}>
          <ActionIcon
            size="xl"
            radius="xl"
            variant="light"
            onClick={openSettingsModal}
          >
            <IconSettings size={18} />
          </ActionIcon>
        </Affix>
      </Tooltip>

      <Modal
        opened={modalVisible}
        onClose={hideSettingsModal}
        title="Ustawienia"
        size="xl"
      >
        <Stack spacing="xl">
          <TextInput
            label="Ścieka do pliku z danymi"
            placeholder="Źródło danych"
            radius="xl"
            defaultValue={sourcePath}
            rightSection={
              <FileButton
                onChange={(file) => handleSourceSelection(file?.path)}
              >
                {(props) => (
                  <ActionIcon
                    radius="xl"
                    variant="filled"
                    color={theme.primaryColor}
                    {...props}
                  >
                    <IconFileDatabase size={18} />
                  </ActionIcon>
                )}
              </FileButton>
            }
          />

          <Divider />

          <Button onClick={() => checkUpdates()}>Sprawdź aktualizację</Button>
          <TextInput value={feedURL} disabled />
        </Stack>
      </Modal>
    </>
  );
};

export default Settings;
