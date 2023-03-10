import React from "react";
import {
  Button,
  Card,
  Circle,
  Stack,
  Text,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import CoverImage from "../../assets/images/volunteer.svg";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

export default function EventCard() {
  const theme = useTheme();

  return (
    <Card
      flex={1}
      bg="$green12"
      style={{
        shadowColor: theme.gray12.val,
        shadowRadius: 30,
        elevation: 2,
      }}
    >
      <YStack flex={1} p={8}>
        <XStack justifyContent="center" bg="$green4" borderRadius={6}>
          <Text fontSize={32} my="$4" fontWeight="700" color="$green12">
            PlastOPol
          </Text>
        </XStack>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Stack>
            <CoverImage height={300} width={300} />
          </Stack>
        </YStack>
        <XStack justifyContent="flex-end" alignItems="stretch" space="$2">
          <XStack flex={1} borderWidth={0.5} borderColor="$green5" bg="$green2" borderStyle="solid" alignItems="center" px="$2" borderRadius={6} space="$2">
            <Circle space="$2" alignItems="center" bg="$green5" p="$2">
              <MaterialIcon name="event" size={16} color={theme.green11.val} />
            </Circle>
            <XStack alignItems="center" justifyContent="center" flex={1} space="$2">
              <Text>Upcoming Event</Text>
              <Stack w={1} bg="$green8" h={24}></Stack>
              <Text>24/3/23</Text>
            </XStack>
          </XStack>
          <Button bg="$green10">
            <Text color="white">Join Us</Text>
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
