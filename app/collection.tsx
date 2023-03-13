import React, { useEffect, useState } from "react";
import { Button, XStack, YStack, useTheme } from "tamagui";
import ImageRoll from "../components/ImageRoll/ImageRoll";
import * as MediaLibrary from "expo-media-library";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import * as ImagePicker from "expo-image-picker";
import { ImageWithAnnotation } from "../@types/global";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useStore } from "../state";

export default function ImageList() {
  const theme = useTheme();
  const router = useRouter();

  const imageList = useStore((state) => state.imageList);
  const setImageList = useStore((state) => state.setImageList);

  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [album, setAlbum] = useState<MediaLibrary.Album | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (permission?.status !== MediaLibrary.PermissionStatus.GRANTED) {
      requestPermission();
    } else {
      MediaLibrary.getAlbumAsync(IMAGE_STORAGE_LOCATION).then((foundAlbum) => {
        if (foundAlbum) {
          setAlbum(foundAlbum);
        } else {
          setAlbum(null);
        }
      });
    }
  }, [permission]);

  // * Update image list on initial load and when album changes.
  useEffect(() => {
    if (album) {
      updateImageList(album);
    }
  }, [album]);

  // * If we don't have permissions, we show nothing.
  if (!permission?.granted) {
    return null;
  }

  // * Since async, we show nothing until we know if the album exists.
  // * null means we have permissions but no album, undefined means we're still loading.
  if (album === undefined) {
    return null;
  }

  const updateImageList = async (album: MediaLibrary.Album) => {
    try {
      const foundAssets = await MediaLibrary.getAssetsAsync({
        album: album,
      });

      setImageList(
        foundAssets.assets.map((asset) => ({
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
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const assets = await Promise.all(
      result.assets.map((asset) => MediaLibrary.createAssetAsync(asset.uri))
    );
    return assets;
  };

  const createAlbum = async (images: MediaLibrary.Asset[]) => {
    try {
      const [first, ...rest] = images;

      const createdAlbum = await MediaLibrary.createAlbumAsync(
        IMAGE_STORAGE_LOCATION,
        first,
        false
      );

      if (rest.length !== 0) {
        await MediaLibrary.addAssetsToAlbumAsync(rest, createdAlbum!.id, false);
      }

      setAlbum(createdAlbum);

      return createdAlbum;
    } catch (error) {
      console.error(error);
    }

    throw Error("Could not create album.");
  };

  const onRequestAddImages = async () => {
    /**
     * * If album is null, create a new album and add images to it.
     * * (Needed for special case of android)
     */
    const result = await pickImage();

    if (!album) {
      if (result) {
        const createdAlbum = await createAlbum(result);
        await updateImageList(createdAlbum);
      }
    } else {
      if (result) {
        await MediaLibrary.addAssetsToAlbumAsync(result, album.id, false);
        await updateImageList(album);
      }
    }
  };

  const onRequestRemoveImage = async (id: string) => {
    // TODO: Implement
  };

  const onRequestAnnotateImage = async (asset: ImageWithAnnotation) => {
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
      <XStack
        style={{
          shadowColor: theme.gray12.val,
          shadowRadius: 30,
          elevation: 4,
        }}
        p="$2"
        space="$2"
        bg="white"
      >
        <Button
          flex={1}
          icon={
            <MaterialIcon
              name="monochrome-photos"
              size={20}
              color={theme.green10.val}
            />
          }
          onPress={onRequestAddImages}
        >
          Camera
        </Button>
        <Button
          flex={1}
          alignItems="center"
          icon={
            <MaterialIcon
              name="photo-library"
              size={20}
              color={theme.green10.val}
            />
          }
          onPress={onRequestAddImages}
        >
          Import
        </Button>
      </XStack>
    </YStack>
  );
}
