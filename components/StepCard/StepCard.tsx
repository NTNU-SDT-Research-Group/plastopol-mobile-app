import React from "react";
import { Image } from "react-native";
import { Text, YStack } from "tamagui";
import Step1 from "../../assets/images/step-1.svg";
import Step2 from "../../assets/images/step-2.svg";
import Step3 from "../../assets/images/step-3.svg";

function Container({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <YStack bg="$purple2" borderColor="$purple10" borderWidth="$0.75" borderRadius={12} mx="$2" py="$2" pb="$4" flex={1} space="$2" justifyContent="center" alignItems="center">
      {children}
    </YStack>
  );
}

const StepArray: JSX.Element[] = [
  <Container>
    <>
      <Text fontSize={32}>
        <Text color="$red10Light">C</Text>apture
      </Text>
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Step1 height={220}/>
      </YStack>
      <Text w="75%" textAlign="center">
        Capture image of the marine debris you found. Make sure it is clearly
        visible in the view finder 📷.
      </Text>
    </>
  </Container>,
  <Container>
    <>
      <Text fontSize={32}>
        <Text color="$yellow10Light">A</Text>nnotate
      </Text>
      <YStack flex={1} justifyContent="center" alignItems="center">
      <Step2 height={220} />
      </YStack>
      <Text w="75%" textAlign="center">
        Annotate the image by drawing a bounding box around the marine debris.
        Make sure to include the entire debris in the bounding box 🔍.
      </Text>
    </>
  </Container>,
  <Container>
    <>
      <Text fontSize={32}>
        <Text color="$purple10Light">U</Text>pload
      </Text>
      <YStack flex={1} justifyContent="center" alignItems="center">
      <Step3 height={220}/>
      </YStack>
      <Text w="75%" textAlign="center">
        Upload the image to the server. We will use this information to detect
        marine debris 🌊.
      </Text>
    </>
  </Container>,
];

type StepCardProps = {
  stepIndex: number;
};

export default function StepCard({ stepIndex }: StepCardProps) {
  return StepArray[stepIndex];
}
