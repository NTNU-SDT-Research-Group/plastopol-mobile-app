import { XStack, YStack } from "tamagui";
import React from "react";
import PressableCard from "../components/PressableCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import EventCard from "../components/EventCard";
import { Image } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <YStack space="$2" p={"$2"} bg="$gray2" flex={1}>
      <YStack flex={1}>
        <EventCard />
      </YStack>
      <XStack h="30%" maxHeight={400} justifyContent="center" space="$2">
        <PressableCard
          bg="$purple12"
          flex={1}
          title="Collection"
          icon={
            <Image
              style={{
                width: 65,
                height: 65,
              }}
              source={require("../assets/images/gallery-icon.png")}
            />
          }
          onPress={() => router.push("collection")}
        />
        <PressableCard
          bg="$blue12"
          flex={1}
          title="Capture"
          icon={
            <Image
              style={{
                width: 140,
                height: 140,
              }}
              source={require("../assets/images/camera-icon.png")}
            />
          }
          onPress={() => router.push("capture")}
        />
      </XStack>
    </YStack>
  );
}
