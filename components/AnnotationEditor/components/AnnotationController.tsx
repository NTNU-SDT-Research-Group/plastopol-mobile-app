import React from "react";
import { Button, useTheme } from "tamagui";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import BottomBar from "../../BottomBar";
import { AnnotationModeType } from "../../types";

type AnnotationControllerProps = {
  mode: AnnotationModeType;
  onChangeToAddMode: () => void;
  onCancelAddMode: () => void;
  onDeleteAnnotation: () => void;
};

export default function AnnotationController({
  mode,
  onChangeToAddMode,
  onCancelAddMode,
  onDeleteAnnotation,
}: AnnotationControllerProps) {
  const theme = useTheme();

  if (mode === AnnotationModeType.EDIT_ADD_ANNOTATION) {
    return (
      <BottomBar zIndex={2} space="$2">
        <Button
          flex={1}
          onPress={onCancelAddMode}
          alignItems="center"
          icon={
            <MaterialCommunityIcon
              name="close"
              size={20}
              color={theme.red9.val}
            />
          }
        >
          Cancel Add
        </Button>
      </BottomBar>
    );
  }

  return (
    <BottomBar zIndex={2} space="$2">
      {mode === AnnotationModeType.EDIT_MODIFY_ANNOTATION ? (
        <Button
          flex={1}
          onPress={onDeleteAnnotation}
          alignItems="center"
          icon={
            <MaterialCommunityIcon
              name="delete"
              size={20}
              color={theme.red9.val}
            />
          }
        >
          Delete
        </Button>
      ) : (
        <Button
          flex={1}
          onPress={onChangeToAddMode}
          alignItems="center"
          icon={
            <MaterialCommunityIcon
              name="image-filter-center-focus"
              size={20}
              color={theme.green10.val}
            />
          }
        >
          Add
        </Button>
      )}
      <Button
        flex={1}
        onPress={() => {}}
        alignItems="center"
        icon={
          <MaterialCommunityIcon
            name="content-save"
            size={20}
            color={theme.green10.val}
          />
        }
      >
        Save
      </Button>
    </BottomBar>
  );
}
