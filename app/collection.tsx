import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Stack, XStack, YStack, useTheme } from "tamagui";
import ImageRoll from "../components/ImageRoll/ImageRoll";
import * as MediaLibrary from "expo-media-library";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet } from "react-native";
import { ImageWithAnnotation } from "../@types/global";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function ImageList() {
  const theme = useTheme();
  const router = useRouter();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [album, setAlbum] = useState<MediaLibrary.Album | null | undefined>(
    undefined
  );
  const [imageList, setImageList] = useState<ImageWithAnnotation[]>([]);

  useEffect(() => {
    if (permissionResponse?.status !== MediaLibrary.PermissionStatus.GRANTED) {
      requestPermission();
    } else {
      const foundAlbum = MediaLibrary.getAlbumAsync(
        IMAGE_STORAGE_LOCATION
      ).then((foundAlbum) => {
        if (foundAlbum) {
          setAlbum(foundAlbum);
        } else {
          setAlbum(null);
        }
      });
    }
  }, [permissionResponse]);

  // * Update image list on initial load and when album changes.
  useEffect(() => {
    if (album) {
      updateImageList(album);
    }
  }, [album]);

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

  const createAlbum = async () => {
    const result = await pickImage();

    if (!result) {
      throw Error("No image selected.");
    }

    try {
      const [first, ...rest] = result;

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
    if (!album) {
      const createdAlbum = await createAlbum();
      await updateImageList(createdAlbum);
    } else {
      const result = await pickImage();

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
        assetId: asset.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1}>
        <YStack bg="$blue1" flex={1}>
          <ImageRoll imageList={imageList} onPress={onRequestAnnotateImage} />
        </YStack>
        <XStack p="$2" space="$2" bg="$blue2">
          <Button
            flex={1}
            icon={
              <MaterialIcon
                name="monochrome-photos"
                size={20}
                color={theme.purple11.val}
              />
            }
            onPress={onRequestAddImages}
          >
            Capture
          </Button>
          <Button
            flex={1}
            alignItems="center"
            icon={
              <MaterialIcon
                name="photo-library"
                size={20}
                color={theme.purple11.val}
              />
            }
            onPress={onRequestAddImages}
          >
            Import
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
