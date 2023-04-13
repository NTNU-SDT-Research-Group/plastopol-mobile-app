export function getImageDimensions(containerDimensions: {width: number, height: number} | null, aspectRatio: number) {
  const imageWidth = containerDimensions?.width ?? 0;
  const imageHeight = (containerDimensions?.width ?? 0) / aspectRatio;

  const imageX =
    ((containerDimensions ? containerDimensions.width : 0) -
      imageWidth) /
    2;
  const imageY =
    ((containerDimensions ? containerDimensions.height : 0) -
      imageHeight) /
    2;

  return {
    width: imageWidth,
    height: imageHeight,
    x: imageX,
    y: imageY,
  }
}