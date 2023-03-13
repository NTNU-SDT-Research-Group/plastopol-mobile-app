import React, { useEffect, useRef } from "react";
import { Stack, YStack } from "tamagui";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useState } from "react";
import CameraController from "../components/CameraController";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import { Image, StyleSheet } from "react-native";

export default function Capture() {
  const cameraRef = useRef<Camera>(null);

  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const [albumPermission, requestAlbumPermission] =
    MediaLibrary.usePermissions();

  const [currentImage, setCurrentImage] =
    useState<CameraCapturedPicture | null>(null);
  const [album, setAlbum] = useState<MediaLibrary.Album | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  useEffect(() => {
    if (albumPermission?.status !== MediaLibrary.PermissionStatus.GRANTED) {
      requestAlbumPermission();
    } else {
      MediaLibrary.getAlbumAsync(IMAGE_STORAGE_LOCATION).then((foundAlbum) => {
        if (foundAlbum) {
          setAlbum(foundAlbum);
        } else {
          setAlbum(null);
        }
      });
    }
  }, [albumPermission]);

  if (!cameraPermission?.granted || !albumPermission?.granted) {
    return null;
  }

  if (album === undefined) {
    return null;
  }

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

  const savePicture = async () => {
    const picture = currentImage;
    if (picture) {
      const asset = await MediaLibrary.createAssetAsync(picture.uri);

      if (!album) {
        const createdAlbum = await createAlbum([asset]);
        setAlbum(createdAlbum);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setCurrentImage(data);
    }
  };

  return (
    <YStack flex={1}>
      <Stack flex={1}>
        {currentImage ? (
          <Image style={styles.preview} source={{ uri: currentImage.uri }} />
        ) : (
          <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
            {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View> */}
          </Camera>
        )}
      </Stack>
      <CameraController
        isPreview={currentImage !== null}
        onDiscard={() => setCurrentImage(null)}
        onCapture={takePicture}
        onSave={savePicture}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: "100%",
  },
  camera: {
    flex: 1,
  },
});
