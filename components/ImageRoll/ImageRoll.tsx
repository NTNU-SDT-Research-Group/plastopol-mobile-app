import React from "react";
import { Button, XStack, YStack, useTheme, ScrollView } from "tamagui";
import { StyleSheet } from "react-native";
import NoImage from "./components/NoImage";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { ImageWithAnnotation } from "../../@types/global";
import Gallery from "./components/Gallery";

type ImageRollProps = {
  onAdd?: () => void;
  imageList: ImageWithAnnotation[];
};

export default function ImageRoll({
  onAdd,
  imageList
}: ImageRollProps) {
  const theme = useTheme();
  const isEmpty = imageList.length === 0;

  return (
    <YStack
      flex={1}
      bg="$blue1"
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
    >
      <YStack flex={1}>{isEmpty ? <NoImage /> : <Gallery imageList={imageList} />}</YStack>
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
            onPress={onAdd}
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
            onPress={onAdd}
          >
            Import
          </Button>
        </XStack>
      </XStack>
    </YStack>
  );
}
