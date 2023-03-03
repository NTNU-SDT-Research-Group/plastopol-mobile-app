import { Stack } from "tamagui";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Stack>
        <Text>Hello World</Text>
      </Stack>
    </SafeAreaView>
  );
}
