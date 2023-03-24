import React, { useState } from "react";
import { Sheet, Text } from "tamagui";

type LabelSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function LabelSheet({open = false, setOpen}: LabelSheetProps) {
  const [position, setPosition] = useState(2);

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
      {/* <Sheet.Overlay /> */}
      <Sheet.Handle />
      <Sheet.Frame flex={1} p="$2">
        <Text>Hello</Text>
        <Sheet.ScrollView p="$2" space></Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
