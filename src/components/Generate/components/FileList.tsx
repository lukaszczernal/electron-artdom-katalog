import { useClientFileUpdate } from "@/services";
import { Group } from "@mantine/core";

interface Props {
  list: string[];
}

export const FileList: React.FC<Props> = ({ list }) => {
  const { fileUpdateStatus } = useClientFileUpdate();

  return (
    <ul>
      {list.map((pageId) => (
        <li key={pageId}>
          <Group spacing="xs">
            <span>{pageId}</span>
            <span>{fileUpdateStatus[pageId]}</span>
          </Group>
        </li>
      ))}
    </ul>
  );
};
