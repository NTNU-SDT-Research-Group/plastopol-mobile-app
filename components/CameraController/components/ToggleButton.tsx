import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Stack, useTheme } from "tamagui";
import { MaterialIcons as MaterialIcon } from "@expo/vector-icons";

type ToggleButtonProps = {
  onPress: () => void;
  isPreview: boolean;
};

export const ToggleButton = ({ onPress, isPreview }: ToggleButtonProps) => {
  const theme = useTheme();

  return (
    <Stack
      style={[
        styles.button,
        {
          shadowColor: theme.gray12.val,
          shadowRadius: Platform.OS === "ios" ? 0 : 10,
          elevation: 1,
        },
      ]}
      onPress={onPress}
      bg={isPreview ? "$red7" : "$gray11"}
    >
      <View
        style={[
          styles.buttonInner,
          {
            backgroundColor: isPreview ? theme.red4.val : theme.gray5.val,
            shadowColor: theme.gray12.val,
            shadowRadius: 10,
            elevation: 2,
          },
        ]}
      >
        {isPreview ? (
          <MaterialIcon name="delete-forever" size={32} color="red" />
        ) : (
          <MaterialIcon name="camera" size={32} color="grey" />
        )}
      </View>
    </Stack>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    width: 52,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  buttonInner: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
