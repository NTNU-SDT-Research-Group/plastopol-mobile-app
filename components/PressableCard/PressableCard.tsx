import React from "react";
import { Card, CardProps, YStack, Stack, Text, XStack, useTheme } from "tamagui";

type PressableCardProps = CardProps & {
  title: string;
  icon: JSX.Element;
};

export default function PressableCard({
  title,
  icon,
  ...rest
}: PressableCardProps) {
  const theme = useTheme();

  return (
    <Card
      {...rest}
      style={{
        shadowColor: theme.gray12.val,
        shadowRadius: 30,
        elevation: 2,
      }}
    >
      <YStack flex={1} p={8} alignItems="center">
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize={18} fontWeight="700" color="white">
            {title}
          </Text>
        </YStack>
        <Stack borderWidth={0.5} width="90%" borderColor="$gray1"></Stack>
        <Stack h="60%" justifyContent="center" alignItems="center">
          {icon}
        </Stack>
      </YStack>
    </Card>
  );
}
