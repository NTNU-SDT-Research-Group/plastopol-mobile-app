import React from "react";
import { Button, useTheme } from "tamagui";
import {
  MaterialCommunityIcons as MaterialCommunityIcon,
  MaterialIcons as MaterialIcon,
} from "@expo/vector-icons";

import BottomBar from "../../BottomBar";
import { useRouter } from "expo-router";

type ImageRollControllerProps = {
  onRequestAddImages: () => void;
  onCancelMultiSelect: () => void;
  isMultiSelectMode: boolean;
  onDeleteSelectedImages: () => void;
  selectedImageIdMap: { [key: string]: boolean };
  onUploadImages: () => void;
};

export function ImageRollController({
  onRequestAddImages,
  isMultiSelectMode,
  onCancelMultiSelect,
  onDeleteSelectedImages,
  selectedImageIdMap,
  onUploadImages
}: ImageRollControllerProps) {
  const router = useRouter();
  const theme = useTheme();

  if (isMultiSelectMode) {
    const hasSelectedImage =
      Object.values(selectedImageIdMap).filter((items) => items).length > 0;

    return (
      <BottomBar>
        <Button
          circular
          chromeless
          icon={
            <MaterialCommunityIcon
              name="delete"
              size={32}
              color={hasSelectedImage ? theme.red9.val : theme.gray9.val}
            />
          }
          onPress={onDeleteSelectedImages}
          disabled={!hasSelectedImage}
        ></Button>
        <Button
          circular
          chromeless
          icon={
            <MaterialCommunityIcon
              name="upload"
              size={32}
              color={theme.green9.val}
            />
          }
          onPress={onUploadImages}
        ></Button>
        <Button
          circular
          chromeless
          icon={
            <MaterialCommunityIcon
              name="close"
              size={32}
              color={theme.red9.val}
            />
          }
          onPress={onCancelMultiSelect}
        ></Button>
      </BottomBar>
    );
  }

  return (
    <BottomBar>
      <Button
        circular
        chromeless
        icon={
          <MaterialIcon
            name="monochrome-photos"
            size={32}
            color={theme.color9.val}
          />
        }
        onPress={() => router.push("capture")}
      ></Button>
      <Button
        circular
        chromeless
        icon={
          <MaterialIcon
            name="photo-library"
            size={32}
            color={theme.color9.val}
          />
        }
        onPress={onRequestAddImages}
      ></Button>
    </BottomBar>
  );
}
