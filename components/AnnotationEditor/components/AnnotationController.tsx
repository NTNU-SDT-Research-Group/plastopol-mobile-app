import React from "react";
import { Button, useTheme } from "tamagui";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import BottomBar from "../../BottomBar";

type AnnotationControllerProps = {
  mode: "preview" | "edit-add-annotation" | "edit-modify-annotation" | "edit";
  onRequestAdd: () => void;
  onCancelAdd: () => void;
  onRemoveAnnotation: () => void;
};

export default function AnnotationController({
  mode,
  onRequestAdd,
  onCancelAdd,
  onRemoveAnnotation,
}: AnnotationControllerProps) {
  const theme = useTheme();

  if (mode === "edit-add-annotation") {
    return (
      <BottomBar zIndex={2} space="$2">
        <Button
          flex={1}
          onPress={onCancelAdd}
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
      {mode === "edit-modify-annotation" ? (
        <Button
          flex={1}
          onPress={onRemoveAnnotation}
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
          onPress={onRequestAdd}
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
