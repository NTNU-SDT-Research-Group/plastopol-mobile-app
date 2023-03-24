import React from "react";
import { TamaguiComponent, XStack, useTheme } from "tamagui";

type BottomBarProps = {
  children?: React.ReactNode;
  [x:string]: any;
};

export default function BottomBar({
  children,
  styles,
  ...rest
}: BottomBarProps) {
  const theme = useTheme();

  return (
    <XStack
      {...rest}
      style={[
        styles,
        {
          shadowColor: theme.gray12.val,
          shadowRadius: 30,
          elevation: 4,
        },
      ]}
      h={64}
      alignItems="center"
      bg="white"
    >
      {children}
    </XStack>
  );
}
