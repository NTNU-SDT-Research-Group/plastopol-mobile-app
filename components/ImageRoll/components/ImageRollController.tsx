import React from "react";
import { Button, useTheme } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

import BottomBar from "../../BottomBar";
import { useRouter } from "expo-router";

type ImageRollControllerProps = {
  onRequestAddImages: () => void;
  onCancelMultiSelect: () => void;
  isMultiSelectMode: boolean;
  onDeleteSelectedImages: () => void;
  selectedImageIdMap: { [key: string]: boolean };
};

export function ImageRollController({
  onRequestAddImages,
  isMultiSelectMode,
  onCancelMultiSelect,
  onDeleteSelectedImages,
  selectedImageIdMap,
}: ImageRollControllerProps) {
  const router = useRouter();
  const theme = useTheme();

  if (isMultiSelectMode) {
    const hasSelectedImage =
      Object.values(selectedImageIdMap).filter((items) => items).length > 0;

    return (
      <BottomBar p="$2" space="$2">
        <Button
          flex={1}
          icon={
            <MaterialCommunityIcon
              name="delete"
              size={20}
              color={hasSelectedImage ? theme.red9.val : theme.gray9.val}
            />
          }
          onPress={onDeleteSelectedImages}
          disabled={!hasSelectedImage}
        >
          Delete
        </Button>
        <Button
          flex={1}
          alignItems="center"
          icon={
            <MaterialCommunityIcon
              name="close"
              size={20}
              color={theme.red9.val}
            />
          }
          onPress={onCancelMultiSelect}
        >
          Cancel
        </Button>
      </BottomBar>
    );
  }

  return (
    <BottomBar p="$2" space="$2">
      <Button
        flex={1}
        icon={
          <MaterialIcon
            name="monochrome-photos"
            size={20}
            color={theme.green10.val}
          />
        }
        onPress={() => router.push("capture")}
      >
        Camera
      </Button>
      <Button
        flex={1}
        alignItems="center"
        icon={
          <MaterialIcon
            name="photo-library"
            size={20}
            color={theme.green10.val}
          />
        }
        onPress={onRequestAddImages}
      >
        Import
      </Button>
    </BottomBar>
  );
}
