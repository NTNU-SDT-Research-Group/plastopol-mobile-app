import React from "react";
import { Matrix4, identity4, multiply4 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { concat, vec3 } from "../utils/MatrixHelper";
import { SkRect } from "@shopify/react-native-skia";

type AnnotationGestureHandlerProps = {
  id: string;
  dimensions: SkRect;
  baseMatrix: SharedValue<Matrix4>;
  color?: string;
  baseX: number;
  baseY: number;
  onLongPress: (id: string) => void;
};

export function ModifyAnnotationGestureHandler({
  id,
  dimensions,
  baseMatrix,
  color = "100, 200, 300",
  baseX,
  baseY,
  onLongPress
}: AnnotationGestureHandlerProps) {
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
      matrix.value = concat(offset.value, origin.value, [
        { scale: event.scale },
      ]);
    });

  const longPress = Gesture.LongPress().onStart((event) => {
    runOnJS(onLongPress)(id);
  });

  const canvasContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -dimensions.width / 2 },
      { translateY: -dimensions.height / 2 },
      { matrix: multiply4(baseMatrix.value, matrix.value) as any },
      { translateY: dimensions.height / 2 },
      { translateX: dimensions.width / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(scale, pan, longPress)}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: `rgba(${color}, 0.2)`,
            borderColor: `rgba(${color}, 0.7)`,
            borderWidth: 1,
            position: "absolute",
            left: baseX + dimensions.x,
            top: baseY + dimensions.y,
            width: dimensions.width,
            height: dimensions.height,
          },
          canvasContainerStyle,
        ]}
      />
    </GestureDetector>
  );
}
