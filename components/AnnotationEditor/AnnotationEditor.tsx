import React, { useState } from "react";
import { YStack } from "tamagui";
import { Image as ImageType } from "../../@types/global";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import AnnotationController from "./components/AnnotationController";

import { LabelSheet } from "./components/LabelSheet";

import { GestureHandler } from "./components/GestureHandler";

type AnnotationEditorProps = {
  image: ImageType;
};

export default function AnnotationEditor({ image }: AnnotationEditorProps) {
  

  const uri = useImage(image.path);
  const aspectRatio = image.width / image.height;

  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [gestureContainerWidth, setGestureContainerWidth] = useState(0);
  const [gestureContainerHeight, setGestureContainerHeight] = useState(0);

  const imageWidth = gestureContainerWidth;
  const imageHeight = gestureContainerWidth / aspectRatio;

  if (!uri) {
    return null;
  }

  return (
    <YStack flex={1}>
      <YStack
        flex={1}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setGestureContainerWidth(layout.width);
          setGestureContainerHeight(layout.height);
        }}
      >
        <GestureHandler gestureContainerHeight={gestureContainerHeight} gestureContainerWidth={gestureContainerWidth}>
          {gestureContainerWidth !== 0 && (
            <Canvas style={{ flex: 1, backgroundColor: "black" }}>
              <Image
                image={uri}
                fit="contain"
                x={(gestureContainerWidth - imageWidth) / 2} // why?
                y={(gestureContainerHeight - imageHeight) / 2} // why?
                width={imageWidth}
                height={imageHeight}
              />
            </Canvas>
          )}
        </GestureHandler>
      </YStack>
      <LabelSheet open={labelSheetOpen} setOpen={setLabelSheetOpen} />
      <AnnotationController />
    </YStack>
  );
}
