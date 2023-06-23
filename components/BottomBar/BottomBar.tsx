import React from "react";
import { TamaguiComponent, XStack, useTheme } from "tamagui";

type BottomBarProps = {
  children?: React.ReactNode;
  [x: string]: any;
};

export default function BottomBar({
  children,
  styles,
  ...rest
}: BottomBarProps) {
  return (
    <XStack
      {...rest}
      p="$2"
      bg="$color5"
      borderTopWidth="$1"
      borderTopColor="$color7"
      h={64}
      alignItems="center"
      justifyContent="space-evenly"
      space="$2"
    >
      {children}
    </XStack>
  );
}
