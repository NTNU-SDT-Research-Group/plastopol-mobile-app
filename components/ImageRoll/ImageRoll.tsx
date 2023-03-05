import React from "react";
import { Image, useWindowDimensions, Stack, YStack } from "tamagui";
import NoImage from "./components/NoImage";
import { ImageWithAnnotation } from "../../@types/global";
import { FlatList, StyleSheet } from "react-native";

type ImageRollProps = {
  imageList: ImageWithAnnotation[];
  onPress: (asset: ImageWithAnnotation) => void;
};

export default function ImageRoll({ imageList, onPress }: ImageRollProps) {
  const isEmpty = imageList.length === 0;

  const { width } = useWindowDimensions();

  const renderItem = ({ item }: { item: ImageWithAnnotation }) => (
    <Stack width={width / 3} aspectRatio={1}>
      <Image
        onPress={() => onPress(item)}
        style={{
          width: "100%",
          height: "100%",
        }}
        key={item.id}
        src={item.path}
        height={100}
        width={100}
      />
    </Stack>
  );

  return (
    <YStack flex={1}>
      {isEmpty ? (
        <NoImage />
      ) : (
        <FlatList
          keyExtractor={(item) => item.id}
          data={imageList}
          renderItem={renderItem}
          numColumns={3}
        />
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "flex-start",
  },
});
