import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useTheme } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

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
          shadowColor: theme.gray5.val,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
      onPress={onPress}
      bg={isPreview ? "$red7" : "$gray8"}
    >
      <View
        style={[
          styles.buttonInner,
          {
            backgroundColor: isPreview ? theme.red4.val : theme.gray7.val,
            shadowColor: theme.gray5.val,
            shadowRadius: 4,
            elevation: 2,
          },
        ]}
      >
        {isPreview ? (
          <MaterialIcon name="delete-forever" size={32} color="red" />
        ) : (
          <MaterialIcon name="camera" size={32} color="black" />
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
