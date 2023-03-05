import React from "react";

import { Stack, ScrollView, Image } from "tamagui";
import { ImageWithAnnotation } from "../../../@types/global";

type GalleryProps = {
  imageList: ImageWithAnnotation[];
};

export default function Gallery({ imageList }: GalleryProps) {
  console.log(imageList);

  return (
    <ScrollView flex={1}>
      <Stack flexDirection="row" width={'100%'} flexWrap="wrap" gap={4} justifyContent="flex-start">
        {imageList.map((image, index) => (
          <Image style={{
            width: '32%',
          }} key={image.id} src={image.path} height={100} width={100} />
        ))}
      </Stack>
    </ScrollView>
  );
}
