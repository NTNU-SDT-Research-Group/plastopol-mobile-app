import React from "react";
import { Image, useWindowDimensions, Stack, YStack, useTheme } from "tamagui";
import NoImage from "./components/NoImage";
import { ImageWithAnnotation } from "../../@types/global";
import { FlatList, StyleSheet } from "react-native";

type ImageRollProps = {
  imageList: ImageWithAnnotation[];
  onPress: (asset: ImageWithAnnotation) => void;
};

export default function ImageRoll({ imageList, onPress }: ImageRollProps) {
  const theme = useTheme();

  const isEmpty = imageList.length === 0;

  const { width } = useWindowDimensions();

  const renderItem = ({ item }: { item: ImageWithAnnotation }) => (
    <Stack
      width={width / 3}
      aspectRatio={1}
      justifyContent="center"
      alignItems="center"
      key={item.id}
    >
      <Stack
        style={{
          width: "96%",
          height: "96%",
          shadowColor: theme.gray12.val,
          shadowRadius: 30,
          elevation: 2,
        }}
        onPress={() => onPress(item)}
        borderRadius={6}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
          }}
          borderRadius={6}
          src={item.path}
          height={100}
          width={100}
        />
      </Stack>
    </Stack>
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

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "flex-start",
  },
});
