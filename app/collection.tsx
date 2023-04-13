import React from "react";
import { YStack } from "tamagui";
import ImageRoll, { ImageRollController } from "../components/ImageRoll";
import { Album } from "expo-media-library";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import * as ImagePicker from "expo-image-picker";
import { Image } from "../components/types";

import { useRouter } from "expo-router";
import { useStore } from "../state";
import {
  useAlbum,
  getAssetListFromAlbum,
  covertUriToAsset,
} from "../utils/media-lib";
import Toast from "react-native-toast-message";

export default function ImageList() {
  const router = useRouter();

  const imageList = useStore((state) => state.imageList);
  const setImageList = useStore((state) => state.setImageList);

  const { album, addImagesToAlbum, permission } = useAlbum({
    imageStorageLocation: IMAGE_STORAGE_LOCATION,
    onAlbumUpdate: async (album: Album) => {
      try {
        const imageAssets = await getAssetListFromAlbum(album);

        setImageList(
          imageAssets.assets.map((asset) => ({
            width: asset.width,
            height: asset.height,
            id: asset.id,
            annotations: null,
            path: asset.uri,
            modificationTime: asset.modificationTime,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    },
  });

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

  const onRequestRemoveImage = async (id: string) => {
    // TODO: Implement
  };

  const onRequestAnnotateImage = async (asset: Image) => {
    // TODO: Extend to annotate multiple
    router.push({
      pathname: "/annotate",
      params: {
        selectedAssetIDList: [asset.id, asset.id, asset.id],
        isPreview: true,
      },
    });
  };

  return (
    <YStack flex={1} bg="$gray2">
      <YStack flex={1}>
        <ImageRoll imageList={imageList} onPress={onRequestAnnotateImage} />
      </YStack>
      <ImageRollController onRequestAddImages={onRequestAddImages} />
    </YStack>
  );
}
