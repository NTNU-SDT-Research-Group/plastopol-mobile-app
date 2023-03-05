import { YStack, XStack, Stack } from "tamagui";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PressableCard from "../components/PressableCard";
import FoundationIcon from "@expo/vector-icons/Foundation";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <YStack space p={"$2"} height={"100%"}>
        <YStack flex={1} backgroundColor={"red"}>
          <Text>Hello World</Text>
        </YStack>
        <XStack justifyContent="center" space="$2">
          <XStack flex={1}>
            <PressableCard
              flex={1}
              title="Annotate"
              icon={<FoundationIcon name="annotate" size={32} color="green" />}
              onPress={() => router.push("collection")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});