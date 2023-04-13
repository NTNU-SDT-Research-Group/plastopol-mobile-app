import React from "react";
import { Matrix4, identity4, multiply4, toMatrix3 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { concat, vec3 } from "../utils/MatrixHelper";
import { SkRect } from "@shopify/react-native-skia";
import { Image } from "react-native";

type GestureHandlerProps = {
  matrix: SharedValue<Matrix4>;
  dimensions: SkRect;
  uri: string;
  imageDimensions: SkRect;
  baseX: number;
  baseY: number;
};

export function ImageGestureHandler({
  dimensions,
  matrix,
  uri,
  baseX,
  baseY,
  imageDimensions,
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

  const animatedStyles = useAnimatedStyle(() => ({
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
      <Animated.View
        style={[
          {
            flex: 1,
            width: dimensions.width,
            height: dimensions.height,
            position: "absolute",
            left: dimensions.x,
            top: dimensions.y,
          },
          animatedStyles,
        ]}
      >
        <Image
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
            transform: [{ translateX: baseX }, { translateY: baseY }],
          }}
          source={{
            uri,
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
}
