import React from 'react';
import { Text, XStack, Spacer, Stack, Button, useTheme } from 'tamagui';
import FeatherIcon from "@expo/vector-icons/Feather";

export default function Header(){
  const theme = useTheme();

  return (
    <XStack h={64} px={4} bg="$green6" elevation="$10" justifyContent='space-between' alignItems='center'>
      <Stack></Stack>
      <Stack>
        <Button circular bg="$green8">
          <FeatherIcon name="user" size={24} color={theme.green1.val} />
        </Button>
      </Stack>
    </XStack>
  )
}