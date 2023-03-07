import { YStack } from "tamagui";
import React from "react";
import PressableCard from "../components/PressableCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import EventCard from "../components/EventCard";
import { Image } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <YStack space="$2" p={"$2"} flex={1} bg="$green1">
      <YStack flex={1}>
        <EventCard />
      </YStack>
      <YStack h="40%" maxHeight={400} justifyContent="center" space="$2">
        <PressableCard
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
        <PressableCard
          flex={1}
          title="Collection"
          icon={<Image
            style={{
              width: 90,
              height: 90,
            }}
            source={require("../assets/images/gallery-icon.png")}
          />}
          onPress={() => router.push("collection")}
        />
      </YStack>
    </YStack>
  );
}
