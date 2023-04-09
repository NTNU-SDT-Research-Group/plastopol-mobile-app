import React from "react";
import { Button, XStack, useTheme } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import BottomBar from "../../BottomBar";

type AnnotationControllerProps = {};

export default function AnnotationController({}: AnnotationControllerProps) {
  const theme = useTheme();

  return (
    <BottomBar zIndex={2} space="$2">
      <Button
        flex={1}
        onPress={() => {}}
        alignItems="center"
        icon={
          <MaterialCommunityIcon
            name="image-filter-center-focus"
            size={20}
            color={theme.green10.val}
          />
        }
      >
        Add
      </Button>
      <Button
        flex={1}
        onPress={() => {}}
        alignItems="center"
        icon={
          <MaterialCommunityIcon
            name="content-save"
            size={20}
            color={theme.green10.val}
          />
        }
      >
        Save
      </Button>
    </BottomBar>
  );
}