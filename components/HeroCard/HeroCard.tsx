import React from "react";
import { Button, Card, Stack, Text, XStack, useTheme } from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { ImageBackground } from "react-native";

export default function HeroCard() {
  const theme = useTheme();

  return (
    <Card flex={1} bg="red" borderRadius="$4" overflow="hidden">
      <ImageBackground
        source={require("../../assets/images/title-card-background.png")}
        resizeMode="cover"
        style={{
          flex: 1,
          padding: 8,
        }}
      >
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <LinearGradient
            colors={["$purple11", "$blue11"]}
            start={[0, 0.5]}
            end={[1, 0.5]}
            w="90%"
            h={2}
            pos={"absolute"}
            borderRadius={4}
          />
          <XStack>
            <Text fontSize={48} fontWeight="700">
              Plast
            </Text>
            <Text fontSize={48} fontWeight="700">
              O
            </Text>
            <Text fontSize={48} fontWeight="700">
              Pol
            </Text>
          </XStack>
        </Stack>
        <Stack>
          <Button themeInverse opacity={0.5}>Know More</Button>
        </Stack>
      </ImageBackground>
    </Card>
  );
}
