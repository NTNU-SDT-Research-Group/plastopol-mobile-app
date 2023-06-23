import React from "react";
import { Image, useWindowDimensions, Stack, YStack, useTheme } from "tamagui";
import NoImage from "./components/NoImage";
import { Image as ImageType } from "../types";
import { FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons as MaterialCommunityIcon } from "@expo/vector-icons";

type ImageRollProps = {
  imageList: ImageType[];
  onPress: (asset: ImageType) => void;
  annotatedImageIdMap: { [key: string]: boolean };
  onRequestMultiSelect: () => void;
  onSelectImage: (imageId: string) => void;
  isMultiSelectMode: boolean;
  selectedImageIdMap: { [key: string]: boolean };
};

export default function ImageRoll({
  imageList,
  annotatedImageIdMap,
  onPress,
  onRequestMultiSelect,
  onSelectImage,
  isMultiSelectMode,
  selectedImageIdMap,
}: ImageRollProps) {
  const theme = useTheme();

  const isEmpty = imageList.length === 0;

  const { width } = useWindowDimensions();

  const renderItem = ({ item }: { item: ImageType }) => (
    <Pressable
      key={item.id}
      onLongPress={() => {
        onRequestMultiSelect();
        onSelectImage(item.id);
      }}
      onPress={() =>
        !isMultiSelectMode ? onPress(item) : onSelectImage(item.id)
      }
    >
      <Stack
        width={width / 3}
        aspectRatio={1}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {annotatedImageIdMap[item.id] && (
          <Stack position="absolute" top={6} left={6} zIndex={1}>
            <MaterialCommunityIcon
              name="image-filter-center-focus"
              size={24}
              color={theme.yellow9.val}
            />
          </Stack>
        )}
        {isMultiSelectMode && (
          <Stack position="absolute" top={6} right={6} zIndex={1}>
            {!selectedImageIdMap[item.id] ? (
              <MaterialCommunityIcon
                name="checkbox-blank-outline"
                size={24}
                color={theme.color9.val}
              />
            ) : (
              <MaterialCommunityIcon
                name="checkbox-intermediate"
                size={24}
                color={theme.color9.val}
              />
            )}
          </Stack>
        )}
        <Image
          style={{
            zIndex: 0,
            width: "96%",
            height: "96%",
            shadowColor: theme.gray12.val,
          }}
          borderRadius={6}
          source={{ uri: item.path }}
          height={100}
          width={100}
        />
      </Stack>
    </Pressable>
  );

  return (
    <YStack flex={1}>
      {isEmpty ? (
        <NoImage />
      ) : (
        <FlatList
          style={{
            paddingTop: 8,
          }}
          keyExtractor={(item) => item.id}
          data={imageList}
          renderItem={renderItem}
          numColumns={3}
        />
      )}
    </YStack>
  );
}
