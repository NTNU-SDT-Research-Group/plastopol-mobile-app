import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, YStack } from "tamagui";
import ImageRoll from "../components/ImageRoll/ImageRoll";
import * as MediaLibrary from "expo-media-library";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet } from "react-native";
import { ImageWithAnnotation } from "../@types/global";

export default function ImageList() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [album, setAlbum] = React.useState<
    MediaLibrary.Album | null | undefined
  >(undefined);
  const [imageList, setImageList] = React.useState<ImageWithAnnotation[]>([]);

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

  useEffect(() => {
    if (album) {
      MediaLibrary.getAssetsAsync({
        album: album,
      }).then((foundAssets) => {
        // TODO: Query DB
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
      });
    }
  }, [album]);

  if (album === undefined) {
    return null;
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled || result.assets.length === 0) {
      alert("You did not select any image.");
      return;
    }

    const assets = await Promise.all(
      result.assets.map((asset) => MediaLibrary.createAssetAsync(asset.uri))
    );
    return assets;
  };

  const createAlbum = async () => {
    const result = await pickImage();

    if (album === null && result) {
      try {
        const [first, ...rest] = result;

        const createdAlbum = await MediaLibrary.createAlbumAsync(
          IMAGE_STORAGE_LOCATION,
          first,
          false
        );

        if (rest.length !== 0) {
          await MediaLibrary.addAssetsToAlbumAsync(
            rest,
            createdAlbum!.id,
            false
          );
        }

        setAlbum(createdAlbum);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onRequestAddImages = async () => {
    if(!album) createAlbum();

    const result = await pickImage();

    if (result) {
      await MediaLibrary.addAssetsToAlbumAsync(result, album!.id, false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack flex={1}>
        <YStack flex={1} elevation={1}>
          <ImageRoll
            imageList={imageList}
            onAdd={onRequestAddImages}
          />
        </YStack>
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
