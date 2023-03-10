import { StatusBar as BaseStatusBar } from "expo-status-bar";
import React from "react";
import { useTheme } from "tamagui";

export default function StatusBar() {
  const theme = useTheme();

  return <BaseStatusBar style="auto" />;
}
