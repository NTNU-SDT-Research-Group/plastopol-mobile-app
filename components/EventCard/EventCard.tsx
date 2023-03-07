import React from "react";
import { Button, Card, Image, Stack, Text, XStack, YStack } from "tamagui";
import CoverImage from "../../assets/images/volunteer.svg";
import { LinearGradient } from "tamagui/linear-gradient";

export default function EventCard() {
  return (
    <Card flex={1}>
      <LinearGradient flex={1} colors={["$green3", "$green6"]}>
        <YStack flex={1} p={8}>
          <XStack>
            <YStack justifyContent="flex-end">
              <Text fontSize={42}>March</Text>
            </YStack>
            <YStack>
              <Text fontSize={102} verticalAlign="bottom">
                24
              </Text>
            </YStack>
          </XStack>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Stack>
              <CoverImage height={300} width={300} />
            </Stack>
          </YStack>
          <XStack justifyContent="flex-end" alignItems="flex-end">
            <Button bg="$green7">
              <Text color="$green1">Join Us</Text>
            </Button>
          </XStack>
        </YStack>
      </LinearGradient>
    </Card>
  );
}
