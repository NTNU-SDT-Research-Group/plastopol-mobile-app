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

export default function Header({ back }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <XStack
      // TODO: Add shadow
      // style={{
      //   shadowColor: theme.gray12.val,
      //   shadowRadius: 30,
      //   elevation: 4,
      //   backgroundColor: "white",
      //   height: 64,
      //   flexDirection: "row",
      //   justifyContent: "space-between",
      //   alignItems: "center",
      //   paddingHorizontal: 8,
      // }}
      h={64}
      justifyContent="space-between"
      alignItems="center"
      px="$2"
      bg="$color5"
      borderBottomWidth="$1"
      borderBottomColor="$color7"
    >
      <Stack>
        {back && (
          <Button circular borderColor="$color7" onPress={() => router.back()}>
            <MaterialIcon
              name="arrow-back"
              size={24}
              color={theme.color10.val}
            />
          </Button>
        )}
      </Stack>
      <Stack>
        <Button circular borderColor="$color7">
          <FeatherIcon name="user" size={24} color={theme.color10.val} />
        </Button>
      </Stack>
    </XStack>
  );
}
