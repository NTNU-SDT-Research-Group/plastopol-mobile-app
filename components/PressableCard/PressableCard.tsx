import React from "react";
import { Card, H4, CardProps, YStack } from "tamagui";

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
    <Card {...rest} py="$2" pb="$3" space="$2" theme="dark" elevate bordered>
      <Card.Header alignItems="center">
        <H4>{title}</H4>
      </Card.Header>
      <YStack alignItems="center">{icon}</YStack>
    </Card>
  );
}
