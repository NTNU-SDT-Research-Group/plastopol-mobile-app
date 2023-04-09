import React, { useEffect, useState } from "react";
import { YStack } from "tamagui";
import { Image as ImageType } from "../../@types/global";
import {
  Canvas,
  Image,
  SkRect,
  Skia,
  useImage,
  useSharedValueEffect,
  useValue,
} from "@shopify/react-native-skia";
import AnnotationController from "./components/AnnotationController";

import { LabelSheet } from "./components/LabelSheet";

import { CanvasGestureHandler } from "./components/GestureHandler";
import { AnnotationGestureHandler } from "./components/AnnotationGestureHandler";
import { useSharedValue } from "react-native-reanimated";
import { identity4, toMatrix3 } from "react-native-redash";
import { useStore } from "../../state";

const annotationMap: {
  [key: string]: Record<
    string,
    { labelId: string; x: number; y: number; width: number; height: number }
  >;
} = {
  "256": {
    "1": { labelId: "label1", x: 0, y: 0, width: 100, height: 100 },
    "2": { labelId: "label2", x: 200, y: 200, width: 100, height: 100 },
  },
};

type AnnotationEditorProps = {
  image: ImageType;
};

export default function AnnotationEditor({ image }: AnnotationEditorProps) {
  const labelMap = useStore((state) => state.labelMap);

  const annotations = annotationMap["256"] ?? [];
  const uri = useImage(image.path);
  const aspectRatio = image.width / image.height;

  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [gestureContainerDimensions, setGestureContainerDimensions] =
    useState<null | { width: number; height: number; x: number; y: number }>(
      null
    );

  const matrix = useSharedValue(identity4);
  const pictureMatrix = useValue(Skia.Matrix());

  useEffect(() => {
    if (!labelSheetOpen) {
      setActiveAnnotationId(null);
    }
  }, [labelSheetOpen]);

  useSharedValueEffect(() => {
    // * INFO: changing outer matrix controlling image with the inner matrix controlled by gesture handler
    pictureMatrix.current = Skia.Matrix(toMatrix3(matrix.value));
  }, matrix);

  const onLongPress = (id: string) => {
    setLabelSheetOpen(true);
    setActiveAnnotationId(id);
  };

  const imageWidth = gestureContainerDimensions?.width ?? 0;
  const imageHeight = (gestureContainerDimensions?.width ?? 0) / aspectRatio;

  const imageX =
    ((gestureContainerDimensions ? gestureContainerDimensions.width : 0) -
      imageWidth) /
    2;
  const imageY =
    ((gestureContainerDimensions ? gestureContainerDimensions.height : 0) -
      imageHeight) /
    2;

  if (!uri) {
    return null;
  }

  return (
    <YStack flex={1}>
      <YStack
        flex={1}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setGestureContainerDimensions({
            ...layout,
          });
        }}
      >
        {gestureContainerDimensions !== null && (
          <>
            <Canvas style={{ flex: 1, backgroundColor: "black" }}>
              <Image
                image={uri}
                fit="contain"
                // the x y change is need to center the image
                x={imageX} // top left corner of image
                y={imageY} // top left corner of image
                width={imageWidth}
                height={imageHeight}
                matrix={pictureMatrix}
              />
            </Canvas>

            <CanvasGestureHandler
              dimensions={gestureContainerDimensions as SkRect}
              matrix={matrix}
            />

            {Object.entries(annotations).map(
              ([id, { x, y, width, height, labelId }]) => (
                <AnnotationGestureHandler
                  key={id}
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
                  baseMatrix={matrix}
                  baseX={imageX}
                  baseY={imageY}
                  onLongPress={onLongPress}
                />
              )
            )}
          </>
        )}
      </YStack>
      <LabelSheet
        labelId={
          activeAnnotationId ? annotations[activeAnnotationId].labelId : null
        }
        onChangeLabel={(labelId: string) => {
          if (activeAnnotationId) {
            annotations[activeAnnotationId].labelId = labelId;
          }
        }}
        open={labelSheetOpen}
        setOpen={setLabelSheetOpen}
      />
      <AnnotationController />
    </YStack>
  );
}
