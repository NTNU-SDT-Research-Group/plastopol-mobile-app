import React from "react";
import { Button, useTheme } from "tamagui";
import { MaterialCommunityIcons as MaterialCommunityIcon } from "@expo/vector-icons";
import BottomBar from "../../BottomBar";
import { AnnotationModeType } from "../../types";
import { useStore } from "../../../store";

type AnnotationControllerProps = {
  mode: AnnotationModeType;
  onChangeToAddMode: () => void;
  onCancelAddMode: () => void;
  onDeleteAnnotation: () => void;
  onSaveAnnotation: () => void;
  isDirty: boolean;
};

export default function AnnotationController({
  mode,
  onChangeToAddMode,
  onCancelAddMode,
  onDeleteAnnotation,
  onSaveAnnotation,
  isDirty,
}: AnnotationControllerProps) {
  const theme = useTheme();
  const showLabel = useStore((state) => state.showLabel);
  const toggleShowLabel = useStore((state) => state.toggleShowLabel);

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
      <Button circular flex={1} onPress={toggleShowLabel}>
        {!showLabel ? (
          <MaterialCommunityIcon
            name="alphabetical"
            size={28}
            color={theme.green10.val}
          />
        ) : (
          <MaterialCommunityIcon
            name="alphabetical-off"
            size={28}
            color={theme.green10.val}
          />
        )}
      </Button>
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
        onPress={onSaveAnnotation}
        alignItems="center"
        icon={
          <MaterialCommunityIcon
            name="content-save"
            size={20}
            color={isDirty ? theme.green10.val : theme.gray9.val}
          />
        }
        disabled={!isDirty}
      >
        Save
      </Button>
    </BottomBar>
  );
}
