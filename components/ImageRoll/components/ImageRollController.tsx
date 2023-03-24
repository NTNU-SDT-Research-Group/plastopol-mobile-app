import React from "react";
import { Button, useTheme } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

import BottomBar from "../../BottomBar";
import { useRouter } from "expo-router";

type ImageRollControllerProps = { 
  onRequestAddImages: () => void;
}

export function ImageRollController({onRequestAddImages}: ImageRollControllerProps) {
  const router = useRouter();
  const theme = useTheme();

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
