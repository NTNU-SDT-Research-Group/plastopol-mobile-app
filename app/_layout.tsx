import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { Stack as StackRouter } from 'expo-router';

export default function HomeLayout() {
  return (
    <NativeBaseProvider>
      <StackRouter screenOptions={{headerShown: false}}>
        <StackRouter.Screen name="index" />
      </StackRouter>
      <StatusBar style="auto" />
    </NativeBaseProvider>
    
  );
}
