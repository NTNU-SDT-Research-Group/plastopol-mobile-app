import React, { useContext, useEffect, useState } from "react";
import { YStack } from "tamagui";
import ImageRoll, { ImageRollController } from "../components/ImageRoll";
import * as ImagePicker from "expo-image-picker";
import { Image } from "../components/types";
import * as Haptics from "expo-haptics";

import { useRouter } from "expo-router";
import { useStore } from "../store";
import {
  covertUriToAsset,
} from "../utils/media-lib";
import Toast from "react-native-toast-message";
import { databaseContext } from "../providers/DatabaseProvider";
import { MediaContext } from "../providers/MediaProvider";

export default function ImageList() {
  const router = useRouter();

  const {
    getImageIdsWithValidAnnotations,
    addAnnotationUpdateListener,
    removeAnnotationUpdateListener,
    cleanupStaleAnnotations,
  } = useContext(databaseContext);

  const imageList = useStore((state) => state.imageList);
  const [annotatedImageIdMap, setAnnotatedImageIdMap] = useState({});
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedImageIdMap, setSelectedImageIdMap] = useState<
    Record<string, boolean>
  >({});

  const { album, deleteImagesFromAlbum, permission, addImagesToAlbum } =
    useContext(MediaContext);

  useEffect(() => {
    if (!multiSelectMode) {
      setSelectedImageIdMap({});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [multiSelectMode]);

  useEffect(() => {
    const onAnnotationUpdate = () =>
      getImageIdsWithValidAnnotations((imageIds) => {
        setAnnotatedImageIdMap(
          imageIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
        );
      });

    onAnnotationUpdate();
    addAnnotationUpdateListener(onAnnotationUpdate);

    return () => removeAnnotationUpdateListener(onAnnotationUpdate);
  }, []);

  // * If we don't have permissions, we show nothing.
  if (!permission?.granted) {
    return null;
  }

  // * Since async, we show nothing until we know if the album exists.
  // * null means we have permissions but no album, undefined means we're still loading.
  if (album === undefined) {
    return null;
  }

  const showImagePickerErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "No images selected",
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled || result.assets.length === 0) {
      throw new Error("User cancelled image picker");
    }

    return await covertUriToAsset(result.assets.map(({ uri }) => uri));
  };

  const onRequestAddImages = async () => {
    /**
     * * If album is null, create a new album and add images to it.
     * * (Needed for special case of android)
     */
    try {
      const imageAssets = await pickImage();
      addImagesToAlbum(imageAssets);
    } catch (error) {
      showImagePickerErrorToast();
    }
  };

  const onRequestDeleteImages = async () => {
    const idList = imageList
      .filter((image) => selectedImageIdMap[image.id])
      .map((image) => image.id);

    deleteImagesFromAlbum(idList);
    cleanupStaleAnnotations(idList);
    setMultiSelectMode(false);
  };

  const onRequestAnnotateImage = async (asset: Image) => {
    // TODO: Extend to annotate multiple
    router.push({
      pathname: "/annotate",
      params: {
        selectedAssetIDList: [asset.id],
        isPreview: true,
      },
    });
  };

  return (
    <YStack flex={1} bg="$gray2">
      <YStack flex={1}>
        <ImageRoll
          annotatedImageIdMap={annotatedImageIdMap}
          imageList={imageList}
          onPress={onRequestAnnotateImage}
          isMultiSelectMode={multiSelectMode}
          onRequestMultiSelect={() => setMultiSelectMode(true)}
          onSelectImage={(id: string) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedImageIdMap({
              ...selectedImageIdMap,
              [id]: !selectedImageIdMap[id],
            });
          }}
          selectedImageIdMap={selectedImageIdMap}
        />
      </YStack>
      <ImageRollController
        onCancelMultiSelect={() => {
          setMultiSelectMode(false);
        }}
        isMultiSelectMode={multiSelectMode}
        onDeleteSelectedImages={onRequestDeleteImages}
        onRequestAddImages={onRequestAddImages}
        selectedImageIdMap={selectedImageIdMap}
      />
    </YStack>
  );
}
