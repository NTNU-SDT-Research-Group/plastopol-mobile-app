import React, { useState } from "react";
import { Sheet, Text } from "tamagui";
import { useStore } from "../../../state";

type LabelSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  labelId: string | null;
  onChangeLabel: (labelId: string) => void;
};

export function LabelSheet({
  open = false,
  setOpen,
  labelId,
  onChangeLabel,
}: LabelSheetProps) {
  const labelMap = useStore((state) => state.labelMap);
  const [position, setPosition] = useState(2);

  if (!labelId) {
    return null;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      zIndex={1}
      snapPoints={[90, 50, 20]}
      dismissOnSnapToBottom
      dismissOnOverlayPress={false}
      position={position}
      onPositionChange={setPosition}
    >
      <Sheet.Handle />
      <Sheet.Frame flex={1} p="$2">
        <Text>{labelMap[labelId].title}</Text>
        <Sheet.ScrollView p="$2" space></Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
