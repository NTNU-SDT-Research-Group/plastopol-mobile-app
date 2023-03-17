import React, { useEffect, useRef } from "react";
import { Stack, YStack } from "tamagui";
import { Asset } from "expo-media-library";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useState } from "react";
import CameraController from "../components/CameraController";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import { Image, StyleSheet } from "react-native";
import { covertUriToAsset, useAlbum } from "../utils/media-lib";

export default function Capture() {
  const cameraRef = useRef<Camera>(null);

  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const {
    album,
    addImagesToAlbum,
    permission: albumPermission,
  } = useAlbum({
    imageStorageLocation: IMAGE_STORAGE_LOCATION,
  });

  const [currentImage, setCurrentImage] =
    useState<CameraCapturedPicture | null>(null);

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  if (!cameraPermission?.granted || !albumPermission?.granted) {
    return null;
  }

  if (album === undefined) {
    return null;
  }

  const savePicture = async () => {
    const picture = currentImage;
    if (picture) {
      const ImageAsset = await covertUriToAsset([picture.uri]);

      await addImagesToAlbum(ImageAsset);
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
