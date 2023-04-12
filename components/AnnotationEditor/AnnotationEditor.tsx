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
import * as Haptics from "expo-haptics";

import { LabelSheet } from "./components/LabelSheet";

import { ImageGestureHandler } from "./components/ImageGestureHandler";
import { ModifyAnnotationGestureHandler } from "./components/ModifyAnnotationGestureHandler";
import { AddAnnotationGestureHandler } from "./components/AddAnnotationGestureHandler";
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

  const uri = useImage(image.path);
  const aspectRatio = image.width / image.height;

  const [annotations, setAnnotations] = useState(annotationMap["256"] ?? {});
  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [activeLabelId, setActiveLabelId] = useState<string | null>(
    Object.keys(labelMap)[0]
  );
  const [mode, setMode] = useState<
    "preview" | "edit-add-annotation" | "edit-modify-annotation" | "edit"
  >("edit");
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

    if (!labelSheetOpen && mode === "edit-add-annotation") {
      setMode("edit");
      setActiveAnnotationId(null);
    }
  }, [labelSheetOpen]);

  useSharedValueEffect(() => {
    // * INFO: changing outer matrix controlling image with the inner matrix controlled by gesture handler
    pictureMatrix.current = Skia.Matrix(toMatrix3(matrix.value));
  }, matrix);

  const requestAddMode = () => {
    setMode("edit-add-annotation");
    setLabelSheetOpen(true);
  };

  const cancelAddMode = () => {
    setMode("edit");
    setLabelSheetOpen(false);
  };

  const requestModifyAnnotationMode = (id: string) => {
    setMode("edit-modify-annotation");
    setLabelSheetOpen(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveAnnotationId(id);
  };

  const onChangeAddLabel = (labelId: string) => {
    setActiveLabelId(labelId);
  };

  const onAddAnnotation = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const annotationId = Math.random().toString();
    setAnnotations({
      ...annotations,
      [annotationId]: {
        labelId: activeLabelId ?? "label1",
        x,
        y,
        width,
        height,
      },
    });

    setMode("edit");
    setLabelSheetOpen(false);
  };

  const getLabel = () => {
    if (mode === "edit-add-annotation") {
      return activeLabelId;
    } else {
      return activeAnnotationId
        ? annotations[activeAnnotationId].labelId
        : null;
    }
  };

  const onModifyAnnotation = (labelId: string) => {
    if (activeAnnotationId) {
      annotations[activeAnnotationId].labelId = labelId;
      setAnnotations({ ...annotations });
    }
  };

  const onRemoveAnnotation = () => {
    if (activeAnnotationId) {
      delete annotations[activeAnnotationId];
      setAnnotations({ ...annotations });
    }

    setActiveAnnotationId(null);
    setLabelSheetOpen(false);
    setMode("edit");
  }

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

            <ImageGestureHandler
              dimensions={gestureContainerDimensions as SkRect}
              matrix={matrix}
            />

            {mode === "edit-add-annotation" && (
              <AddAnnotationGestureHandler
                baseMatrix={matrix}
                baseX={imageX}
                baseY={imageY}
                dimensions={
                  {
                    width: imageWidth,
                    height: imageHeight,
                  } as SkRect
                }
                onAddAnnotation={onAddAnnotation}
              />
            )}

            {Object.entries(annotations).map(
              ([id, { x, y, width, height, labelId }]) => (
                <ModifyAnnotationGestureHandler
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
                  onLongPress={requestModifyAnnotationMode}
                />
              )
            )}
          </>
        )}
      </YStack>
      <LabelSheet
        labelId={getLabel()}
        onChangeLabel={
          mode === "edit-modify-annotation"
            ? onModifyAnnotation
            : onChangeAddLabel
        }
        open={labelSheetOpen}
        setOpen={setLabelSheetOpen}
      />
      <AnnotationController
        mode={mode}
        onCancelAdd={cancelAddMode}
        onRequestAdd={requestAddMode}
        onRemoveAnnotation={onRemoveAnnotation}
      />
    </YStack>
  );
}
