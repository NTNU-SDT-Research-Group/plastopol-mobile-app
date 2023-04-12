import React from "react";
import { Matrix4 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SkRect } from "@shopify/react-native-skia";

type GestureHandlerProps = {
  dimensions: SkRect;
  baseMatrix: SharedValue<Matrix4>;
  baseX: number;
  baseY: number;
  onAddAnnotation: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
};

export function AddAnnotationGestureHandler({
  dimensions,
  baseMatrix,
  baseX,
  baseY,
  onAddAnnotation,
}: GestureHandlerProps) {
  const tap = Gesture.Tap().onStart((event) => {
    runOnJS(onAddAnnotation)(event.x, event.y, 100, 100);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -dimensions.width / 2 },
      { translateY: -dimensions.height / 2 },
      { matrix: baseMatrix.value as any },
      { translateY: dimensions.height / 2 },
      { translateX: dimensions.width / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(tap)}>
      <Animated.View
        style={[
          {
            flex: 1,
            borderWidth: 1,
            position: "absolute",
            left: baseX,
            top: baseY,
            width: dimensions.width,
            height: dimensions.height,
          },
          animatedStyle,
        ]}
      />
    </GestureDetector>
  );
}
