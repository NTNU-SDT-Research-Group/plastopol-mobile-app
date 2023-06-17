import { Button, XStack, YStack, useTheme, getTokens } from "tamagui";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";

import EventCard from "../components/HeroCard";
import StepCard, { StepIndicator } from "../components/StepCard";

export default function HomeScreen() {
  const width = Dimensions.get("window").width;

  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const router = useRouter();
  const theme = useTheme();
  const tokens = getTokens({ prefixed: false });

  return (
    <YStack space="$2" p="$2" bg="$color1" flex={1}>
      <YStack flex={1}>
        <EventCard />
      </YStack>
      {/* <XStack flex={1} justifyContent="center" space="$2"> */}
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
      {/* </XStack> */}
      <YStack pb="$2" w={width} ml="$-2" space="$3">
        <Carousel
          loop
          width={width}
          height={420}
          autoPlay={true}
          data={[1, 2, 3]}
          scrollAnimationDuration={1000}
          // TODO: We need on Scoll Begin
          onSnapToItem={(index) => setActiveCardIndex(index)}
          renderItem={({ index }) => <StepCard key={index} stepIndex={index} />}
        />
        <StepIndicator stepIndex={activeCardIndex} maxStep={3} />
      </YStack>
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
