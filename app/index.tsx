import { YStack, XStack, Stack } from "tamagui";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PressableCard from "../components/PressableCard";
import FoundationIcon from "@expo/vector-icons/Foundation";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <YStack space px={"$2"} height={"100%"}>
        <YStack backgroundColor={"red"}>
          <Text>Hello World</Text>
        </YStack>
        <XStack justifyContent="center" space="$2">
          <XStack flex={1}>
            <PressableCard
              flex={1}
              title="Annotate"
              icon={<FoundationIcon name="annotate" size={32} color="green" />}
              onPress={() => router.push("image-list")}
            />
          </XStack>
          <XStack flex={1}>
            <PressableCard
              flex={1}
              title="Capture"
              icon={<MaterialIcon name="camera" size={32} color="blue" />}
              onPress={() => router.push("capture")}
            />
          </XStack>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
