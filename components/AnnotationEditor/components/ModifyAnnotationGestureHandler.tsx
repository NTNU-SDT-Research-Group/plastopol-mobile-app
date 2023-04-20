import React, { useState } from "react";
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
import { Text } from "tamagui";
import { useStore } from "../../../store";

type AnnotationGestureHandlerProps = {
  id: string;
  dimensions: SkRect;
  color?: string;
  baseX: number;
  baseY: number;
  onLongPress: (id: string) => void;
  isEditable: boolean;
  onUpdateDraft: (labelId: string, matrix: number[]) => void;
  baseMatrix: SharedValue<Matrix4>;
  labelText: string;
};

export function ModifyAnnotationGestureHandler({
  id,
  dimensions,
  color = "100, 200, 300",
  baseX,
  baseY,
  onLongPress,
  isEditable,
  onUpdateDraft,
  baseMatrix,
  labelText,
}: AnnotationGestureHandlerProps) {
  const showLabel = useStore((state) => state.showLabel);

  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);
  const origin = useSharedValue(vec3(0, 0, 0));
  const direction = useSharedValue<"horizontal" | "vertical">("horizontal");

  const [textBoxWidth, setTextBoxWidth] = useState<number>(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      if (!isEditable) return;

      const scaleX = baseMatrix.value[0];
      const scaleY = baseMatrix.value[5];
      const innerScaleX = matrix.value[0];
      const innerScaleY = matrix.value[5];
      matrix.value = multiply4(
        matrix.value,
        Matrix4.translate(
          (event.changeX * 1) / (scaleX * innerScaleX),
          (event.changeY * 1) / (scaleY * innerScaleY),
          0
        )
      );
    })
    .onEnd(() => {
      if (!isEditable) return;

      runOnJS(onUpdateDraft)(id, matrix.value as any);
    });

  const scale = Gesture.Pinch()
    .onTouchesDown((event) => {
      if (event.allTouches.length > 1) {
        const [touch1, touch2] = event.allTouches;
        direction.value =
          Math.abs(touch1.x - touch2.x) > Math.abs(touch1.y - touch2.y)
            ? "horizontal"
            : "vertical";
      }
    })
    .onBegin((event) => {
      if (!isEditable) return;

      offset.value = matrix.value;
      origin.value = [event.focalX, event.focalY, 0];
    })
    .onChange((event) => {
      if (!isEditable) return;

      matrix.value = concat(offset.value, origin.value, [
        direction.value === "horizontal"
          ? { scaleX: event.scale }
          : { scaleY: event.scale },
      ]);
    })
    .onEnd(() => {
      if (!isEditable) return;

      runOnJS(onUpdateDraft)(id, matrix.value as any);
    });

  const longPress = Gesture.LongPress().onStart(() => {
    runOnJS(onLongPress)(id);
  });

  const animatedStyles = useAnimatedStyle(() => {
    const scaleX = baseMatrix.value[0];
    const scaleY = baseMatrix.value[5];
    const innerScaleX = matrix.value[0];
    const innerScaleY = matrix.value[5];

    return {
      borderTopWidth: 1 / (scaleY * innerScaleY),
      borderBottomWidth: 1 / (scaleY * innerScaleY),
      borderLeftWidth: 1 / (scaleX * innerScaleX),
      borderRightWidth: 1 / (scaleX * innerScaleX),
      transform: [
        { translateX: -dimensions.width / 2 },
        { translateY: -dimensions.height / 2 },
        { matrix: matrix.value as any },
        { translateY: dimensions.height / 2 },
        { translateX: dimensions.width / 2 },
      ],
    };
  });

  const textAnimatedStyles = useAnimatedStyle(() => {
    const scaleX = baseMatrix.value[0];
    const scaleY = baseMatrix.value[5];
    const innerScaleX = matrix.value[0];
    const innerScaleY = matrix.value[5];

    const width = textBoxWidth;

    return {
      transform: [
        { translateX: -width / 2 },
        { translateY: -16 / 2 },
        { scaleX: 1 / (scaleX * innerScaleX) },
        { scaleY: 1 / (scaleY * innerScaleY) },
        { translateY: -16 },
        { translateX: width / 2 },
        { translateY: 16 / 2 },
      ],
    };
  });

  return (
    <GestureDetector gesture={Gesture.Simultaneous(scale, pan, longPress)}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: isEditable ? `rgba(${color}, 0.2)` : undefined,
            borderColor: `rgba(${color}, 0.7)`,
            position: "absolute",
            left: baseX + dimensions.x,
            top: baseY + dimensions.y,
            width: dimensions.width,
            height: dimensions.height,
          },
          animatedStyles,
        ]}
      >
        {showLabel && (
          <Animated.View
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setTextBoxWidth(width);
            }}
            style={[
              {
                height: 16,
                position: "absolute",
                top: 0,
                left: 0,
              },
              textBoxWidth !== 0 && textAnimatedStyles,
            ]}
          >
            <Text fontSize={10} color={`rgba(${color}, 0.7)`}>
              {labelText}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
