import { Button, XStack, YStack, useTheme } from "tamagui";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import EventCard from "../components/HeroCard";
import { Image } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <YStack space="$2" p="$2" bg="$color1" flex={1}>
      <YStack h="25%">
        <EventCard />
      </YStack>
      <XStack flex={1} justifyContent="center" space="$2">
        {/* <PressableCard
          borderColor="$purple9"
          borderWidth="$0.5"
          bg="$purple2"
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
        /> */}
      </XStack>
      <XStack h="25%" bg="red">

      </XStack>
      <XStack justifyContent="center">
        <Button
          icon={<AntDesign name="camerao" size={24} color={theme.color1.val} />}
          borderRadius={24}
          onPress={() => router.push("capture")}
          alignSelf="center"
          bg="$yellow10"
          w="100%"
          themeInverse
        >
          Capture
        </Button>
      </XStack>
    </YStack>
  );
}
