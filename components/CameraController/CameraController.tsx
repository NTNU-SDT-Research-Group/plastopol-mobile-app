import React from "react";
import { Button, XStack, useTheme } from "tamagui";
import { ToggleButton } from "./components/ToggleButton";
import { CameraType, FlashMode } from "expo-camera";
import {
  MaterialIcons as MaterialIcon,
  MaterialCommunityIcons as MaterialCommunityIcon,
} from "@expo/vector-icons";
import BottomBar from "../BottomBar";

type CameraControllerProps = {
  isPreview: boolean;
  cameraType: CameraType;
  flashMode: FlashMode;
  onCapture: () => void;
  onDiscard: () => void;
  toggleCameraType: () => void;
  toggleFlashMode: () => void;
  onSave: () => void;
  onAnnotate: () => void;
};

export default function CameraController({
  onCapture,
  isPreview,
  onDiscard,
  onSave,
  onAnnotate,
  cameraType,
  flashMode,
  toggleCameraType,
  toggleFlashMode,
}: CameraControllerProps) {
  const theme = useTheme();

  const renderCameraTypeIcon = (mode: CameraType) => {
    return (
      <MaterialIcon name="switch-camera" size={28} color={theme.green9.val} />
    );
  };

  const renderFlashModeIcon = (mode: FlashMode) => {
    switch (mode) {
      case FlashMode.off:
        return (
          <MaterialIcon name="flash-off" size={28} color={theme.green9.val} />
        );
      case FlashMode.on:
        return (
          <MaterialIcon name="flash-on" size={28} color={theme.green9.val} />
        );
      case FlashMode.auto:
        return (
          <MaterialIcon name="flash-auto" size={28} color={theme.green9.val} />
        );
      case FlashMode.torch:
        return <MaterialIcon name="flare" size={28} color={theme.green9.val} />;
    }
  };

  return (
    <BottomBar justifyContent="center" space="$2">
      {isPreview ? (
        <Button
          flex={1}
          onPress={onSave}
          icon={<MaterialIcon name="save" size={20} color={theme.green9.val} />}
        >
          Save
        </Button>
      ) : (
        <XStack flex={1} justifyContent="space-around">
          <Button circular chromeless onPress={toggleCameraType}>
            {renderCameraTypeIcon(cameraType)}
          </Button>
          <Button circular chromeless onPress={toggleFlashMode}>
            {renderFlashModeIcon(flashMode)}
          </Button>
        </XStack>
      )}
      <ToggleButton
        onPress={isPreview ? onDiscard : onCapture}
        isPreview={isPreview}
      />
      {isPreview ? (
        <Button
          flex={1}
          onPress={onAnnotate}
          icon={
            <MaterialCommunityIcon
              name="cube-scan"
              size={20}
              color={theme.green9.val}
            />
          }
        >
          Annotate
        </Button>
      ) : (
        <XStack flex={1}></XStack>
      )}
    </BottomBar>
  );
}
