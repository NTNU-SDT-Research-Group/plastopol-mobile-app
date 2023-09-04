import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { YStack } from "tamagui";
import { AnnotationModeType, Image as ImageType } from "../types";
import { SkRect } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import AnnotationController from "./components/AnnotationController";
import { LabelSheet } from "./components/LabelSheet";
import { ImageGestureHandler } from "./components/ImageGestureHandler";
import { useStore } from "../../store";
import { getImageDimensions } from "./utils/image-dimension-processor";
import { databaseContext } from "../../providers/DatabaseProvider";
import {
  AnnotationDraft,
  convertAnnotationsDraftToAnnotations,
  convertAnnotationsToAnnotationsDraft,
  convertFromTransformToBox,
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
  const [annotationsMap, setAnnotationsMap] = useState<AnnotationDraft>(
    convertAnnotationsToAnnotationsDraft([])
  );
  const draftAnnotationMap = useRef<AnnotationDraft>(annotationsMap);
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

  // Load annotations
  useEffect(() => {
    getAnnotations(imageId)
      .then((annotations) => {
        if (annotations.length > 0) {
          setAnnotationsMap(convertAnnotationsToAnnotationsDraft(annotations));
        }
      })
      .catch(() => {
        console.log("No annotations found for image");
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
        id: Date.now().toString(),
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

  const onUpdateDraft = (labelId: string, matrix: number[]) => {
    setIsDirty(true);
    const result = convertFromTransformToBox(
      { ...annotationsMap[labelId] },
      matrix
    );
    draftAnnotationMap.current[labelId] = {
      ...annotationsMap[labelId],
      ...result,
    };
  };

  const {
    x: baseX,
    y: baseY,
    width: baseWidth,
    height: baseHeight,
  } = getImageDimensions(containerDimensions, aspectRatio);

  const onSaveAnnotation = () => {
    const modifiedAnnotationMap = Object.entries(annotationsMap).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          ...draftAnnotationMap.current[key],
        },
      }),
      {}
    );

    updateAnnotations(
      imageId,
      baseWidth,
      baseHeight,
      convertAnnotationsDraftToAnnotations(modifiedAnnotationMap)
    );

    showAnnotationSaveSuccessToast();
    router.back();
  };

  if (!uri) {
    return null;
  }

  return (
    <YStack flex={1} bg="$color1">
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
          <ImageGestureHandler
            uri={uri}
            dimensions={containerDimensions as SkRect}
            imageDimensions={{ width: baseWidth, height: baseHeight } as SkRect}
            baseX={baseX}
            baseY={baseY}
            requestModifyAnnotationMode={requestModifyAnnotationMode}
            annotationsMap={annotationsMap}
            activeAnnotationId={activeAnnotationId}
            mode={mode}
            onAddAnnotation={onAddAnnotation}
            onUpdateDraft={onUpdateDraft}
          />
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
