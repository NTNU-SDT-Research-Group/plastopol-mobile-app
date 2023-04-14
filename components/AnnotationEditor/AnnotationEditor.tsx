import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { databaseContext } from "../../providers/DatabaseProvider";
import {
  convertAnnotationsDraftToAnnotations,
  convertAnnotationsToAnnotationsDraft,
} from "./utils/annotation-utils";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useRouter } from "expo-router";

type AnnotationEditorProps = {
  imageData: ImageType;
};

export default function AnnotationEditor({ imageData }: AnnotationEditorProps) {
  const router = useRouter();

  const uri = imageData.path;
  const imageId = imageData.id;
  const aspectRatio = imageData.width / imageData.height;

  const { getAnnotations, updateAnnotations } = useContext(databaseContext);

  const labelMap = useStore((state) => state.labelMap);
  const [annotationsMap, setAnnotationsMap] = useState(
    convertAnnotationsToAnnotationsDraft([])
  );
  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [isDirty, setIsDirty] = useState(false);
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

  // Load annotations
  useEffect(() => {
    getAnnotations(imageId, (annotations) => {
      if (annotations.length > 0) {
        setAnnotationsMap(convertAnnotationsToAnnotationsDraft(annotations));
      }
    });
  }, []);

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
        if (activeLabelId === null) {
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
        ? annotationsMap[activeAnnotationId].labelId
        : null;
    }
  }, [mode, activeAnnotationId, activeLabelId, annotationsMap]);

  const showAnnotationSaveSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Annotation saved",
    });
  };

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

    if (!activeLabelId) {
      throw new Error("activeLabelId is null");
    }

    setIsDirty(true);

    setAnnotationsMap({
      ...annotationsMap,
      [annotationId]: {
        labelId: activeLabelId ?? "label1",
        id: Math.random().toString(),
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
      setIsDirty(true);

      annotationsMap[activeAnnotationId].labelId = labelId;
      setAnnotationsMap({ ...annotationsMap });
    }
  };

  const onDeleteAnnotation = () => {
    if (activeAnnotationId) {
      setIsDirty(true);

      delete annotationsMap[activeAnnotationId];
      setAnnotationsMap({ ...annotationsMap });

      // * INFO: reset active annotation id here else label breaks
      setActiveAnnotationId(null);
    }

    setMode(AnnotationModeType.EDIT_MASTER);
  };

  const onSaveAnnotation = () => {
    updateAnnotations(
      imageId,
      convertAnnotationsDraftToAnnotations(annotationsMap)
    );

    showAnnotationSaveSuccessToast();
    router.back();
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
        onSaveAnnotation={onSaveAnnotation}
        isDirty={isDirty}
      />
    </YStack>
  );
}
