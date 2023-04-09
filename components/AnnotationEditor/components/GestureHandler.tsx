import React from 'react';
import { Matrix4, identity4, multiply4 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { concat, vec3 } from "../utils/MatrixHelper";

type GestureHandlerProps = {
  gestureContainerWidth: number;
  gestureContainerHeight: number;
  children: React.ReactNode;
};

export function GestureHandler({
  gestureContainerWidth,
  gestureContainerHeight,
  children,
}: GestureHandlerProps) {
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

  const canvasContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -gestureContainerWidth / 2 },
      { translateY: -gestureContainerHeight / 2 },
      { matrix: matrix.value as any },
      { translateY: gestureContainerHeight / 2 },
      { translateX: gestureContainerWidth / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(scale, pan)}>
      <Animated.View style={[{ flex: 1 }, canvasContainerStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
