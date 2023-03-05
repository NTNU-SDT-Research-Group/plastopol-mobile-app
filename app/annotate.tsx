import { useSearchParams } from "expo-router";
import React from "react";
import { Stack, Text } from "tamagui";

export default function Annotation() {
  const params = useSearchParams();
  const { assetId } = params;
  if(assetId){
    console.log(assetId);
  }

  return (
    <Stack>
      <Text>Image annotation</Text>
    </Stack>
  );
}
