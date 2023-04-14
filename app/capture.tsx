import React, { useEffect, useRef } from "react";
import { Stack, YStack } from "tamagui";
import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  FlashMode,
} from "expo-camera";
import { useState } from "react";
import CameraController from "../components/CameraController";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import { Image, StyleSheet } from "react-native";
import { covertUriToAsset, useAlbum } from "../utils/media-lib";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Capture() {
  const cameraRef = useRef<Camera>(null);
  const router = useRouter();

  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const {
    album,
    addImagesToAlbum,
    permission: albumPermission,
  } = useAlbum({
    imageStorageLocation: IMAGE_STORAGE_LOCATION,
  });
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);

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

  const showImageSaveSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Image saved to album",
    });
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlashMode = () => {
    switch (flashMode) {
      case FlashMode.off:
        setFlashMode(FlashMode.on);
        break;
      case FlashMode.on:
        setFlashMode(FlashMode.auto);
        break;
      case FlashMode.auto:
        setFlashMode(FlashMode.torch);
        break;
      case FlashMode.torch:
        setFlashMode(FlashMode.off);
        break;
      default:
        break;
    }
  };

  const savePicture = async () => {
    const picture = currentImage;
    if (picture) {
      const ImageAsset = await covertUriToAsset([picture.uri]);
      await addImagesToAlbum(ImageAsset);

      setCurrentImage(null);
      showImageSaveSuccessToast();

      return ImageAsset[0].id;
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
          <Camera
            style={styles.camera}
            type={cameraType}
            ref={cameraRef}
            flashMode={flashMode}
          />
        )}
      </Stack>
      <CameraController
        cameraType={cameraType}
        flashMode={flashMode}
        toggleFlashMode={toggleFlashMode}
        toggleCameraType={toggleCameraType}
        isPreview={currentImage !== null}
        onDiscard={() => setCurrentImage(null)}
        onCapture={takePicture}
        onSave={savePicture}
        onAnnotate={async () => {
          const assetId = await savePicture();
          if (assetId) {
            // navigate to annotate screen
            router.push({
              pathname: "/annotate",
              params: {
                selectedAssetIDList: [assetId],
                isPreview: true,
              },
            });
          }
        }}
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
