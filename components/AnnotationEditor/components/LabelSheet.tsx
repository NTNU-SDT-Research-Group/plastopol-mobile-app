import React, { useEffect, useState } from "react";
import { Circle, Input, Sheet, Stack, Text, XStack, YStack } from "tamagui";
import { useStore } from "../../../store";

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
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!open) {
      setPosition(2);
      setFilterText("");
    }
  }, [open]);

  const frameHeader = labelId && (
    <>
      <XStack
        onPress={() => setPosition(1)}
        h={"$5"}
        bg={`rgba(${labelMap[labelId].color}, 0.3)`}
        borderRadius={5}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={28}>{labelMap[labelId].title}</Text>
      </XStack>
      <XStack pt="$2">
        <Input
          placeholder="Filter labels by..."
          width={"100%"}
          size="$4"
          borderWidth={2}
          value={filterText}
          onChangeText={setFilterText}
        />
      </XStack>
    </>
  );

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
        <YStack space="$2">{frameHeader}</YStack>
        <Sheet.ScrollView pt="$2" mb="$10" space="$2">
          {frameHeader &&
            Object.keys(labelMap)
              .filter((innerLabelId) => innerLabelId !== labelId)
              .filter(
                (innerLabelId) =>
                  filterText === "" || innerLabelId.includes(filterText)
              )
              .map((innerLabelId) => (
                <XStack
                  p="$2"
                  borderRadius={5}
                  borderWidth={1}
                  key={innerLabelId}
                  borderColor={`rgba(${labelMap[innerLabelId].color}, 0.5)`}
                  space="$2"
                  alignItems="center"
                  onPress={() => {
                    onChangeLabel(innerLabelId);
                  }}
                >
                  <Circle
                    size="$1"
                    bg={`rgba(${labelMap[innerLabelId].color}, 0.5)`}
                  />
                  <Text fontSize={22}>{labelMap[innerLabelId].title}</Text>
                </XStack>
              ))}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
