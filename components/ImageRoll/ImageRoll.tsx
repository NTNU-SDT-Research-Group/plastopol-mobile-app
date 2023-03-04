import React from "react";
import { Button, Text, XStack } from "tamagui";

type ImageRollProps = {
  isNotCreated: boolean;
  onCreate?: () => void;
  onAdd?: () => void;
};

export default function ImageRoll({ isNotCreated, onCreate, onAdd }: ImageRollProps) {
  return (
    <XStack>
      <Button onPress={isNotCreated ? onCreate : onAdd}>Import</Button>
      <Text>{isNotCreated ? "Not created" : "Image Roll"}</Text>
    </XStack>
  );
}
