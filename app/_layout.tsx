import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack as StackRouter, ErrorBoundary, SplashScreen } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Text, Theme } from "tamagui";
import { useFonts } from "expo-font";
import config from "../tamagui.config";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Header from "../components/Header";

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
      <Theme name="light">
        <Theme name="green">
          <SafeAreaView style={styles.container}>
            <Header />
            <StackRouter screenOptions={{ headerShown: false }}>
              <StackRouter.Screen name="index" />
            </StackRouter>
            <StatusBar style="auto" />
          </SafeAreaView>
        </Theme>
      </Theme>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
