import React from "react";
import { Button, Text, XStack, YStack, useTheme } from "tamagui";
import { StyleSheet } from "react-native";
import NoImage from "./components/NoImage";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

type ImageRollProps = {
  isNotCreated: boolean;
  onCreate?: () => void;
  onAdd?: () => void;
};

export default function ImageRoll({
  isNotCreated,
  onCreate,
  onAdd,
}: ImageRollProps) {
  const theme = useTheme();

  return (
    <YStack
      flex={1}
      bg="$blue1"
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
    >
      <YStack flex={1}>{isNotCreated ? <NoImage /> : null}</YStack>
      <XStack p="$2" space="$2" bg="$blue1">
        <XStack flex={1}>
          <Button
            theme="purple"
            icon={
              <MaterialIcon
                name="monochrome-photos"
                size={20}
                color={theme.purple11.val}
              />
            }
            width={"100%"}
            onPress={isNotCreated ? onCreate : onAdd}
          >
            Capture
          </Button>
        </XStack>
        <XStack flex={1}>
          <Button
            theme="purple"
            als="center"
            icon={
              <MaterialIcon
                name="photo-library"
                size={20}
                color={theme.purple11.val}
              />
            }
            width={"100%"}
            onPress={isNotCreated ? onCreate : onAdd}
          >
            Import
          </Button>
        </XStack>
      </XStack>
    </YStack>
  );
}
