import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "../state";
import AnnotationEditor from "../components/AnnotationEditor/AnnotationEditor";

export default function Annotation() {
  const params = useSearchParams();
  const { isPreview, selectedAssetIDList } = params;

  const editableAssetIDList = (selectedAssetIDList as string).split(",");
  const [activeEditable, setActiveEditable] = useState(editableAssetIDList[0]);
  const imageList = useStore((state) => state.imageList);

  const imageWithAnnotation = imageList.find(
    (image) => image.id === activeEditable
  );

  if (!imageWithAnnotation) {
    throw Error('Image with ID "' + activeEditable + '" not found.');
  }

  return <AnnotationEditor imageData={imageWithAnnotation} />;
}
