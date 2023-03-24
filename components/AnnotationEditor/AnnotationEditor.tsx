import React, { useState } from "react";
import { YStack, useTheme } from "tamagui";
import { Image as ImageType } from "../../@types/global";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import AnnotationController from "./components/AnnotationController";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LabelSheet } from "./components/LabelSheet";
import { Matrix4, identity4, multiply4 } from "react-native-redash";
import { concat, vec3 } from "./utils/MatrixHelper";

type AnnotationEditorProps = {
  image: ImageType;
};

export default function AnnotationEditor({ image }: AnnotationEditorProps) {
  const theme = useTheme();

  const uri = useImage(image.path);
  const aspectRatio = image.width / image.height;

  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [gestureContainerWidth, setGestureContainerWidth] = useState(0);
  const [gestureContainerHeight, setGestureContainerHeight] = useState(0);

  const imageWidth = gestureContainerWidth;
  const imageHeight = gestureContainerWidth / aspectRatio;

  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);
  const origin = useSharedValue(vec3(0, 0, 0));

  const pan = Gesture.Pan().onChange((event) => {
    matrix.value = multiply4(
      matrix.value,
      Matrix4.translate(event.changeX, event.changeY, 0)
    );
  });

  const scale = Gesture.Pinch()
    .onBegin((event) => {
      offset.value = matrix.value;
      origin.value = [event.focalX, event.focalY, 0];
    })
    .onChange((event) => {
      // matrix.value = multiply4(
      //   matrix.value,
      //   Matrix4.scale(event.scaleChange, event.scaleChange, 1)
      // );
      matrix.value = concat(offset.value, origin.value, [
        { scale: event.scale },
      ]);
    });

  const canvasContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -gestureContainerWidth / 2 },
      { translateY: -gestureContainerHeight / 2 },
      { matrix: matrix.value as any },
      { translateY: gestureContainerHeight / 2 },
      { translateX: gestureContainerWidth / 2 },
    ],
  }));

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
        <GestureDetector gesture={Gesture.Race(scale, pan)}>
          <Animated.View style={[{ flex: 1 }, canvasContainerStyle]}>
            {gestureContainerWidth !== 0 && (
              <Canvas style={{ flex: 1, backgroundColor: "black" }}>
                <Image
                  image={uri}
                  fit="contain"
                  x={(gestureContainerWidth - imageWidth) / 2}
                  y={(gestureContainerHeight - imageHeight) / 2}
                  width={imageWidth}
                  height={imageHeight}
                />
              </Canvas>
            )}
          </Animated.View>
        </GestureDetector>
      </YStack>
      <LabelSheet open={labelSheetOpen} setOpen={setLabelSheetOpen} />
      <AnnotationController />
    </YStack>
  );
}
