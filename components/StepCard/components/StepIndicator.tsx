import React from "react";
import { XStack, Circle } from "tamagui";

export function StepIndicator({
  stepIndex,
  maxStep,
}: {
  stepIndex: number;
  maxStep: number;
}) {
  return (
    <XStack space="$2" justifyContent="center">
      {Array.from(Array(maxStep).keys()).map((i) => (
        <Circle key={i} size={10} bg={i === stepIndex ? "white" : "$colorTransparent"} borderColor="white" borderWidth="$0.75" />
      ))}
    </XStack>
  );
}
