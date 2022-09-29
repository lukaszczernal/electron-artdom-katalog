import os from 'os';
import { useState } from "react";
import {
  ActionIcon,
  Affix,
  FileButton,
  Modal,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconFileDatabase, IconSettings } from "@tabler/icons";
import { useSourcePath } from "@/services";
import { SOURCE_FILE_NAME } from "@/constants";

const isWindows = os.platform() === 'win32';

const Settings: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useMantineTheme();
  const { sourcePath, setSourcePath } = useSourcePath();

  const openSettingsModal = () => {
    setModalVisible(true);
  };

  const hideSettingsModal = () => {
    setModalVisible(false);
  };

  const handleSourceSelection = (file: File) => {
    const pathDivider = isWindows ? '\\' : '/';

    const pathParts = file.path.split(pathDivider);
    const dataStorageSubPath = pathParts.splice(-2);
    const [_, filename] = dataStorageSubPath;

    if (filename !== SOURCE_FILE_NAME) {
      return;
    }

    setSourcePath(pathParts.join(pathDivider));
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
        <TextInput
          label="Ścieka do pliku z danymi"
          placeholder="Źródło danych"
          radius="xl"
          defaultValue={sourcePath}
          rightSection={
            <FileButton onChange={handleSourceSelection}>
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
      </Modal>
    </>
  );
};

export default Settings;
