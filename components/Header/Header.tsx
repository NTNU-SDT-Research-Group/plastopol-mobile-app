import React from "react";
import { Stack, Button, useTheme, XStack } from "tamagui";
import FeatherIcon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { View } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

type HeaderProps = {
  // options: any;
  back?: { title: string };
};

// TODO: Button height should be removed
export default function Header({ back }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        shadowColor: theme.gray5.val,
        shadowRadius: -8,
        // TODO: Fix styles
        elevation: 4,
        backgroundColor: "white",
        height: 64,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
      }}
    >
      <Stack>
        {back && (
          <Button w={42} circular bg="$gray4" onPress={() => router.back()}>
            <MaterialIcon
              name="arrow-back"
              size={24}
              color={theme.gray10.val}
            />
          </Button>
        )}
      </Stack>
      <Stack>
        <Button circular w={42} bg="$gray4">
          <FeatherIcon name="user" size={24} color={theme.gray10.val} />
        </Button>
      </Stack>
    </View>
  );
}
