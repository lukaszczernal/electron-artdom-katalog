import React from "react";
import { Button, Group } from "@mantine/core";
import { IconX } from "@tabler/icons";

interface Props {
  keywords?: string[];
  onRemove: (key: string) => void;
}

const Keywords: React.FC<Props> = ({ keywords = [], onRemove }) => {
  return (
    <Group spacing="sm">
      {keywords.map((key) => (
        <Button
          key={key}
          rightIcon={<IconX size={12} />}
          onClick={() => onRemove(key)}
          variant="outline"
          radius="xl"
          size="xs"
        >
          {key}
        </Button>
      ))}
    </Group>
  );
};

export default Keywords;
