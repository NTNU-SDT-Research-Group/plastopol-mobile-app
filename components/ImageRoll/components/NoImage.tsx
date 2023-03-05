import React from "react";
import { Text, YStack } from "tamagui";

export default function NoImage() {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Text>No image</Text>
    </YStack>
  );
}
