import React from "react";
import { Matrix4, identity4, multiply4, toMatrix3 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { concat, vec3 } from "../utils/MatrixHelper";
import {
  SkRect,
} from "@shopify/react-native-skia";

type GestureHandlerProps = {
  matrix: SharedValue<Matrix4>;
  dimensions: SkRect;
  debug?: boolean;
};

export function CanvasGestureHandler({
  dimensions,
  debug,
  matrix,
}: GestureHandlerProps) {
  
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
      matrix.value = concat(offset.value, origin.value, [
        { scale: event.scale },
      ]);
    });

  const canvasContainerStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: dimensions.x,
    top: dimensions.y,
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
    transform: [
      { translateX: -dimensions.width / 2 },
      { translateY: -dimensions.height / 2 },
      { matrix: matrix.value as any },
      { translateY: dimensions.height / 2 },
      { translateX: dimensions.width / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(scale, pan)}>
      <Animated.View style={[{ flex: 1 }, canvasContainerStyle]} />
    </GestureDetector>
  );
}
