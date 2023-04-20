import React from "react";
import { Matrix4, identity4, multiply4, toMatrix3 } from "react-native-redash";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { concat, vec3 } from "../utils/MatrixHelper";
import { SkRect } from "@shopify/react-native-skia";
import { Image } from "react-native";
import { AnnotationModeType } from "../../types";
import { useStore } from "../../../store";
import { ModifyAnnotationGestureHandler } from "./ModifyAnnotationGestureHandler";
import { AnnotationDraft } from "../utils/annotation-utils";

type GestureHandlerProps = {
  dimensions: SkRect;
  uri: string;
  imageDimensions: SkRect;
  baseX: number;
  baseY: number;
  activeAnnotationId: string | null;
  mode: AnnotationModeType;
  requestModifyAnnotationMode: (id: string) => void;
  onAddAnnotation: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  annotationsMap: AnnotationDraft;
  onUpdateDraft: (labelId: string, matrix: number[]) => void;
};

export function ImageGestureHandler({
  dimensions,
  uri,
  baseX,
  baseY,
  imageDimensions,
  activeAnnotationId,
  mode,
  requestModifyAnnotationMode,
  onAddAnnotation,
  annotationsMap,
  onUpdateDraft,
}: GestureHandlerProps) {
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);
  const origin = useSharedValue(vec3(0, 0, 0));

  const labelMap = useStore((state) => state.labelMap);

  const pan = Gesture.Pan().onChange((event) => {
    const scaleX = matrix.value[0];
    const scaleY = matrix.value[5];
    matrix.value = multiply4(
      matrix.value,
      Matrix4.translate(
        (event.changeX * 1) / scaleX,
        (event.changeY * 1) / scaleY,
        0
      )
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

  const tap = Gesture.Tap().onStart((event) => {
    if (mode === AnnotationModeType.EDIT_ADD_ANNOTATION) {
      // Reposition the tap event to the image's coordinate system
      const width = 100;
      const height = 100;
      const repositionedX = event.x - baseX - width / 2;
      const repositionedY = event.y - baseY - height / 2;
      runOnJS(onAddAnnotation)(repositionedX, repositionedY, 100, 100);
    }
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
    <GestureDetector gesture={Gesture.Simultaneous(scale, pan, tap)}>
      <Animated.View
        style={[
          {
            flex: 1,
            width: dimensions.width,
            height: dimensions.height,
            position: "relative",
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

        {Object.entries(annotationsMap).map(
          ([id, { x, y, width, height, labelId }]) => (
            <ModifyAnnotationGestureHandler
              key={id}
              isEditable={
                mode === AnnotationModeType.EDIT_MODIFY_ANNOTATION &&
                id === activeAnnotationId
              }
              dimensions={
                {
                  x,
                  y,
                  width,
                  height,
                } as SkRect
              }
              id={id}
              color={labelMap[labelId].color}
              baseX={baseX}
              baseY={baseY}
              onLongPress={requestModifyAnnotationMode}
              onUpdateDraft={onUpdateDraft}
              baseMatrix={matrix}
              labelText={labelMap[labelId].title}
            />
          )
        )}
      </Animated.View>
    </GestureDetector>
  );
}
