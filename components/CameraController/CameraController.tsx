import React from "react";
import { Button, Text, XStack } from "tamagui";

type CameraControllerProps = {
  isPreview: boolean;
  onCapture: () => void;
  onDiscard: () => void;
  onSave: () => void;
};

export default function CameraController({
  onCapture,
  isPreview,
  onDiscard,
  onSave,
}: CameraControllerProps) {
  return (
    <XStack h={64} justifyContent="center" alignItems="center">
      <Button
        bg={isPreview ? "$red10" : "$green10"}
        circular
        onPress={isPreview ? onDiscard : onCapture}
        style={{
          top: "-50%",
        }}
      >
        <Text></Text>
      </Button>
      {isPreview && <Button onPress={onSave}>Save</Button>}
    </XStack>
  );
}
