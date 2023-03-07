import React from "react";
import { Card, CardProps, YStack, Stack, Text, XStack } from "tamagui";

type PressableCardProps = CardProps & {
  title: string;
  icon: JSX.Element;
};

export default function PressableCard({
  title,
  icon,
  ...rest
}: PressableCardProps) {
  return (
    <Card {...rest} bg="$green4">
      <XStack flex={1} p={8} alignItems="center" space="$4">
        <Stack flex={1} justifyContent="center" alignItems="center">{icon}</Stack>
        <Stack flex={1} justifyContent="center" alignItems="flex-start">
          <Text fontSize={28}>{title}</Text>
        </Stack>
      </XStack>
    </Card>
  );
}
