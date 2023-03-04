import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";
import ImageRoll from "../components/ImageRoll/ImageRoll";
import * as MediaLibrary from "expo-media-library";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import * as ImagePicker from "expo-image-picker";

export default function ImageList() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [album, setAlbum] = React.useState<
    MediaLibrary.Album | null | undefined
  >(undefined);

  useEffect(() => {
    if (permissionResponse?.status !== MediaLibrary.PermissionStatus.GRANTED) {
      requestPermission();
    } else {
      const foundAlbum =MediaLibrary.getAlbumAsync(IMAGE_STORAGE_LOCATION).then((foundAlbum) => {
        if (foundAlbum) {
          console.log("Found album");
          setAlbum(foundAlbum);
        } else {
          console.log("Did not find album");
          setAlbum(null);
        }
      });
    }
  }, [permissionResponse]);

  if (album === undefined) {
    return null;
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
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

  const onRequestAlbumCreation = async () => {
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
    const result = await pickImage();

    if (result) {
      await MediaLibrary.addAssetsToAlbumAsync(result, album!.id, false);
    }
  };

  return (
    <SafeAreaView>
      <YStack>
        <YStack>
          <Text>Image Preview</Text>
        </YStack>
        <YStack>
          <ImageRoll
            isNotCreated={album === null}
            onCreate={onRequestAlbumCreation}
            onAdd={onRequestAddImages}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
