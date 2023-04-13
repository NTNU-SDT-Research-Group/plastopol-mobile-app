import React, { useEffect, useMemo, useState } from "react";
import { YStack } from "tamagui";
import { AnnotationModeType, Image as ImageType } from "../types";
import {
  SkRect,
  Skia,
  useSharedValueEffect,
  useValue,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { identity4, toMatrix3 } from "react-native-redash";
import * as Haptics from "expo-haptics";
import AnnotationController from "./components/AnnotationController";
import { LabelSheet } from "./components/LabelSheet";
import { ImageGestureHandler } from "./components/ImageGestureHandler";
import { ModifyAnnotationGestureHandler } from "./components/ModifyAnnotationGestureHandler";
import { AddAnnotationGestureHandler } from "./components/AddAnnotationGestureHandler";
import { useStore } from "../../state";
import { getImageDimensions } from "./utils/image-dimension-processor";

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
  const uri = image.path;
  const aspectRatio = image.width / image.height;

  const labelMap = useStore((state) => state.labelMap);
  const [annotations, setAnnotations] = useState(annotationMap["256"] ?? {});
  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [activeLabelId, setActiveLabelId] = useState<string | null>(
    Object.keys(labelMap)[0]
  );
  const [mode, setMode] = useState<AnnotationModeType>(
    AnnotationModeType.EDIT_MASTER
  );
  const [containerDimensions, setContainerDimensions] = useState<null | {
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null);

  const matrix = useSharedValue(identity4);
  const pictureMatrix = useValue(Skia.Matrix());

  useSharedValueEffect(() => {
    // * INFO: changing outer matrix controlling image with the inner matrix controlled by gesture handler
    pictureMatrix.current = Skia.Matrix(toMatrix3(matrix.value));
  }, matrix);

  // If label sheet is closed, reset mode
  useEffect(() => {
    if (!labelSheetOpen) {
      setMode(AnnotationModeType.EDIT_MASTER);
    }
  }, [labelSheetOpen]);

  // If mode is edit master, reset activate label and annotation
  useEffect(() => {
    switch (mode) {
      case AnnotationModeType.EDIT_MASTER: {
        setActiveLabelId(null);
        setActiveAnnotationId(null);
        setLabelSheetOpen(false);
        break;
      }
      case AnnotationModeType.EDIT_ADD_ANNOTATION: {
        setLabelSheetOpen(true);
        if(activeLabelId === null) {
          setActiveLabelId(Object.keys(labelMap)[0]);
        }
        break;
      }
      case AnnotationModeType.EDIT_MODIFY_ANNOTATION: {
        setLabelSheetOpen(true);
        break;
      }
    }
  }, [mode]);

  const labelId = useMemo(() => {
    if (mode === AnnotationModeType.EDIT_ADD_ANNOTATION) {
      return activeLabelId;
    } else {
      return activeAnnotationId
        ? annotations[activeAnnotationId].labelId
        : null;
    }
  }, [mode, activeAnnotationId, activeLabelId, annotations]);

  const requestModifyAnnotationMode = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setMode(AnnotationModeType.EDIT_MODIFY_ANNOTATION);
    setActiveAnnotationId(id);
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

    setMode(AnnotationModeType.EDIT_MASTER);
  };

  const onChangeAnnotationLabel = (labelId: string) => {
    if (activeAnnotationId) {
      annotations[activeAnnotationId].labelId = labelId;
      setAnnotations({ ...annotations });
    }
  };

  const onDeleteAnnotation = () => {
    if (activeAnnotationId) {
      delete annotations[activeAnnotationId];
      setAnnotations({ ...annotations });

       // * INFO: reset active annotation id here else label breaks
      setActiveAnnotationId(null);
    }

    setMode(AnnotationModeType.EDIT_MASTER);
  };

  const {
    x: baseX,
    y: baseY,
    width: baseWidth,
    height: baseHeight,
  } = getImageDimensions(containerDimensions, aspectRatio);

  if (!uri) {
    return null;
  }

  return (
    <YStack flex={1}>
      <YStack
        flex={1}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setContainerDimensions({
            ...layout,
          });
        }}
      >
        {containerDimensions !== null && (
          <>
            <ImageGestureHandler
              uri={uri}
              dimensions={containerDimensions as SkRect}
              imageDimensions={
                { width: baseWidth, height: baseHeight } as SkRect
              }
              baseX={baseX}
              baseY={baseY}
              matrix={matrix}
            />

            {mode === AnnotationModeType.EDIT_ADD_ANNOTATION && (
              <AddAnnotationGestureHandler
                baseMatrix={matrix}
                baseX={baseX}
                baseY={baseY}
                dimensions={
                  {
                    width: baseWidth,
                    height: baseHeight,
                  } as SkRect
                }
                onAddAnnotation={onAddAnnotation}
              />
            )}

            {Object.entries(annotations).map(
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
                  baseMatrix={matrix}
                  baseX={baseX}
                  baseY={baseY}
                  onLongPress={requestModifyAnnotationMode}
                />
              )
            )}
          </>
        )}
      </YStack>

      <LabelSheet
        labelId={labelId}
        onChangeLabel={
          mode === AnnotationModeType.EDIT_MODIFY_ANNOTATION
            ? onChangeAnnotationLabel
            : setActiveLabelId
        }
        open={labelSheetOpen}
        setOpen={setLabelSheetOpen}
      />

      <AnnotationController
        mode={mode}
        onCancelAddMode={() => setMode(AnnotationModeType.EDIT_MASTER)}
        onChangeToAddMode={() =>
          setMode(AnnotationModeType.EDIT_ADD_ANNOTATION)
        }
        onDeleteAnnotation={onDeleteAnnotation}
      />
    </YStack>
  );
}
