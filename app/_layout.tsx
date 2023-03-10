import React, { useEffect } from "react";
import StatusBar from "../components/StatusBar";
import { Stack as StackRouter, ErrorBoundary, SplashScreen } from "expo-router";
import { TamaguiProvider, Theme } from "tamagui";
import { useFonts } from "expo-font";
import config from "../tamagui.config";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Header from "../components/Header";

export default function HomeLayout() {
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
        <SafeAreaView style={styles.container}>
          <StackRouter
            initialRouteName="index"
            screenOptions={{
              headerShown: true,
              header: (props) => <Header {...props} />,
            }}
          />
          <StatusBar />
        </SafeAreaView>
      </Theme>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
