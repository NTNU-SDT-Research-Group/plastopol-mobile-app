import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack as StackRouter, ErrorBoundary, SplashScreen } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import config from "../tamagui.config";

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return <SplashScreen />;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <StackRouter screenOptions={{ headerShown: false }}>
          <StackRouter.Screen name="index" />
        </StackRouter>
        <StatusBar style="auto" />
      </Theme>
    </TamaguiProvider>
  );
}
