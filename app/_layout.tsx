import React, { useEffect } from "react";
import StatusBar from "../components/StatusBar";
import { Stack as StackRouter, SplashScreen } from "expo-router";
import { TamaguiProvider, Theme, useTheme } from "tamagui";
import { useFonts } from "expo-font";
import config from "../tamagui.config";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";
import Header from "../components/Header";
import Toast from "react-native-toast-message";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { MediaProvider } from "../providers/MediaProvider";
import { LocationProvider } from "../providers/LocationProvider";

const SafeAreaView = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <SafeAreaViewBase
      style={{
        flex: 1,
        backgroundColor: theme.color2.val,
      }}
    >
      {children}
    </SafeAreaViewBase>
  );
};

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
      <Theme name="blue">
        <DatabaseProvider>
          <MediaProvider>
            <LocationProvider>
              <SafeAreaView>
                <StackRouter
                  initialRouteName="index"
                  screenOptions={{
                    headerShown: true,
                    header: (props) => <Header {...props} />,
                  }}
                />
                <StatusBar />
                <Toast position="top" topOffset={108} />
              </SafeAreaView>
            </LocationProvider>
          </MediaProvider>
        </DatabaseProvider>
      </Theme>
    </TamaguiProvider>
  );
}
