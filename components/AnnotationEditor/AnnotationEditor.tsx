import React from "react";
import { Stack, Text, XStack, YStack, useTheme } from "tamagui";
import { ImageWithAnnotation } from "../../@types/global";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";

type AnnotationEditorProps = {
  data: ImageWithAnnotation;
};

export default function AnnotationEditor({ data }: AnnotationEditorProps) {
  console.log(data.path);

  const image = useImage(data.path);

  if (!image) {
    // TODO: Add loader
    return null;
  }

  return (
    <Stack flex={1}>
      <Canvas style={{ flex: 1 }}>
        <Image
          image={image}
          fit="contain"
          x={0}
          y={0}
          width={256}
          height={256}
        />
      </Canvas>
    </Stack>
  );
}
