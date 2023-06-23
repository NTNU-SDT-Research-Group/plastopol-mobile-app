import React from "react";
import { Stack, Button, useTheme, XStack } from "tamagui";
import { useRouter, usePathname } from "expo-router";
import {
  MaterialIcons as MaterialIcon,
  Entypo as EntypoIcon,
  Feather as FeatherIcon,
} from "@expo/vector-icons";

type HeaderProps = {
  // options: any;
  back?: { title: string };
};

export default function Header({ back }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <XStack
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
        {pathname === "/" && (
          <Button
            circular
            borderColor="$color7"
            onPress={() => router.push("collection")}
          >
            <EntypoIcon name="images" size={24} color={theme.color10.val} />
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
